
Session.set('scriptsLoaded', false);


Fyd = function(element, config){

    var self = this;

    $.getScript("/js/sylvester.js", function(){

        // masse
        self.h = 100;
        self.m = 70;
        self.dudeState = $M([
            [config.world.width/2],
            [0],
            [config.world.height/2],
            [0]
        ]);
        self.ve = 4500; // vitesse appliquee par le joueur - ve = puissance
        self.erg = self.ve/self.m; // note epsilon en cours
        self.gravity = 9.8;
        self.Te = 1/60;
        self.counter = 0;

        self.launched = false;
        self.launching = false;
        self.fps = 60.0;
        self.gfxScaleFactor = 10.0;
        self.onMouseDownDate = -1;
        self.mouseDownDurationLimit = 100;
        self.cfg = config;
        self.phaser = {};
        self.bounds = {};
        self.lastDelta = 0.0;

        self.Ad = $M([
            [1,self.Te,0,0],
            [0,1,0,0],
            [0,0,1,self.Te],
            [0,0,0,1]
        ]);

        self.Bd = $M([
            [self.erg*(self.Te*self.Te)/2, 0],
            [self.erg*self.Te, 0],
            [0, self.erg*(self.Te*self.Te)/2],
            [0, self.erg*self.Te]
        ]);

        self.phaser = new Phaser.Game(config.canvas.width, config.canvas.height, Phaser.CANVAS, element, self);

    });

};

Fyd.prototype = {

    preload : function(){
        this.phaser.load.image('background','assets/sprites/starfield.jpg');
        this.phaser.load.image('player','assets/sprites/the_dude.png');
        this.phaser.load.image('analog', 'assets/sprites/fusia.png');
        this.phaser.load.image('circle', 'assets/sprites/circle.png');
    },

    create : function(){
        // NE PAS METTRE CES DEUX LIGNES PLUS LOIN
        this.setBounds(this.cfg.world.width, this.cfg.world.height);

        this.phaser.physics.startSystem(Phaser.Physics.ARCADE);

        this.phaser.input.mouse.mouseDownCallback = this.onMouseDown;
        this.phaser.input.mouse.callbackContext = this;

        this.loadLevel();

        Session.set('scriptsLoaded', true);
    },

    update : function () {
        if( Session.get('scriptsLoaded') == false )
            return;


    },

    render: function (){
        //this.phaser.debug.text(this.dude.body.x, 32, 32);
        ////this.phaser.debug.text(this.cmd.e(counter, ), 32, 50);

    },

    onMouseUp : function(event) {


    },

    onMouseDown : function(event){
console.log(this.phaser.input.mousePointer);

        this.cmd = this.BoucleOuverte(
            [this.dude.body.x, this.dude.body.y],
            [2*this.dude.body.x - this.phaser.input.mousePointer.x, this.dude.body.y]//+ 2*(this.cfg.canvas.height - event.pageY)]
        );

        ticker.start(this);
    },

    destroy : function(){
        ticker.stop();
        this.phaser.destroy();
        Session.set('scriptsLoaded', false);
    },

    loadLevel : function(){

        this.dude = this.phaser.add.sprite(this.dudeState.e(1, 1), this.dudeState.e(3, 1), 'player');
        this.dude.scale.set(0.5);

        this.phaser.physics.enable(this.dude, Phaser.Physics.ARCADE);
        this.dude.body.collideWorldBounds = true;
        //this.phaser.physics.arcade.gravity.y = 100;


        this.phaser.camera.follow(this.dude) ;

        ticker.subscribe(this.updateCommand);

    },

    updateCommand : function(time, delta){

        if( this.counter > this.h-2){
            this.counter = 0;
            ticker.stop();
        }

/*
        this.lastDelta = this.lastDelta + parseInt(delta);
console.log(this.lastDelta);
        if( this.lastDelta >= this.Te*1000 )
            this.lastDelta = 0;
        else
            return;
*/
        //var a_x = this.cmd.e(this.counter,1);
        //var a_y = this.cmd.e(++this.counter,1)+ this.gravity/this.erg;

        var Un = $M([
            [a_x],
            [a_y-this.gravity/this.erg]
        ]);

        this.dudeState= this.Ad.multiply(this.dudeState).add(this.Bd.multiply(Un));

        this.dude.body.velocity.setTo(this.dudeState.e(2, 1), this.dudeState.e(4, 1));
/*
        this.dude.x = this.dudeState.e(1, 1);
        this.dude.y = this.dudeState.e(3, 1);
*/
        this.counter++;
    },

    setBounds : function(width, height){
        this.bounds.tileMap = this.phaser.add.tileSprite(0, 0, width, height, 'background');
        this.phaser.world.setBounds(0, 0, width, height);
    },

    BoucleOuverte : function(pos, goalPos) {

        // Nombre de periodes d'echantillonnages

        var X0 = $M([
            [pos[0]],
            [0],
            [pos[1]],
            [0]
        ]);
        var Xh = $M([
            [goalPos[0]],
            [0],
            [goalPos[1]],
            [0]
        ]);
        var Cd = $M([
            [1,0,0,0],
            [0,1,0,0],
            [0,0,1,0],
            [0,0,0,1]
        ]);

        // Calcul de la matrice de gouvernabilité G
        var G = this.Bd;
        for (var n = 1; n < this.h; n++ ) {
            var tmpAd = this.Ad
            for (var t = 0; t < n; t++) {
                tmpAd = tmpAd.multiply(this.Ad);
            }
            G = tmpAd.multiply(this.Bd).augment(G);
        }

        if (G.rank() < this.Ad.rows()) {
            console.log("Pas de solutions");
        }
        else {
            console.log("Calcul d'une solution");
            var tmpAd = this.Ad;
            for (var t = 0; t < this.h; t++) {
                tmpAd = tmpAd.multiply(this.Ad);
            }

            var y = Xh.subtract(tmpAd.multiply(X0));
            var Gt = G.transpose();
            var u = Gt.multiply(G.multiply(Gt).inv()).multiply(y);

            return u;
        }
    }

};




