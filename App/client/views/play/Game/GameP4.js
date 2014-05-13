
Session.set('scriptsLoaded', false);


Fyd = function(element, config){

    var self = this;

    $.getScript("/js/sylvester.js", function(){

        // masse
        self.h = 100;
        self.m = 1;
        self.dudeState = $M([
            [config.world.width/2],
            [0],
            [config.world.height/2],
            [0]
        ]);
        self.ve = 45; // vitesse appliquee par le joueur - ve = puissance
        self.erg = self.ve/self.m; // note epsilon en cours
        self.gravity = 9.8*7; //*7 ?
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

        this.phaser.input.keyboard.addKey(Phaser.Keyboard.LEFT)
            .onDown.add(this.actionOnLeft, this);
        this.phaser.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
            .onDown.add(this.actionOnRight, this);
        this.phaser.input.keyboard.addKey(Phaser.Keyboard.UP)
            .onDown.add(this.actionOnUp, this);
        this.phaser.input.keyboard.addKey(Phaser.Keyboard.DOWN)
            .onDown.add(this.actionOnDown, this);

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

    actionOnLeft : function(event) {
    },

    actionOnRight : function(event) {

    },

    actionOnUp : function(event) {

    },

    actionOnDown : function(event) {

    },

    onMouseUp : function(event) {


    },

    onMouseDown : function(event){

        console.log("x : " + this.dude.body.x);
        console.log("y : " + this.dude.body.y);
        console.log("mouseX : " + this.phaser.input.mousePointer.x);
        console.log("mouseY : " + this.phaser.input.mousePointer.y);
        this.cmd = this.BoucleOuverte(
            [this.dude.body.x, -this.dude.body.y],
            [this.phaser.input.mousePointer.x, -this.phaser.input.mousePointer.y]
        );

        ticker.start(this, 200);
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
            console.log("FINI !");
            this.counter = 0;
            ticker.stop();
        }
        else {

            var a_x = this.cmd.e(this.counter * 2 + 1, 1);
            var a_y = this.cmd.e(++this.counter * 2 + 2, 1) + this.gravity / this.erg;

            var Un = $M([
                [a_x],
                [a_y - this.gravity / this.erg]
            ]);

            this.dudeState = this.Ad.multiply(this.dudeState).add(this.Bd.multiply(Un));

            //console.log("e1 : " + this.dudeState.e(1, 1) + "e2 : " + this.dudeState.e(2, 1) + "e3 : " + this.dudeState.e(3, 1) + "e4 : " + this.dudeState.e(4, 1))
            console.log("Acceleration : x = " + a_x + "\ny = " + a_y);
            this.dude.body.acceleration.setTo(a_x / 1, -a_y / 1);

            this.dude.body.x = this.dudeState.e(1, 1);
            this.dude.body.y = -this.dudeState.e(3, 1);

            this.counter++;
        }
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
            var tmpAd = this.power(this.Ad,n);
            G = tmpAd.multiply(this.Bd).augment(G);
        }

        if (G.rank() < this.Ad.rows()) {
            console.log("Erreur : Pas de solutions");
        }
        else {
            var tmpAd = this.Ad;
            for (var t = 0; t < this.h; t++) {
                tmpAd = tmpAd.multiply(this.Ad);
            }

            var y = Xh.subtract(this.power(this.Ad,this.h).multiply(X0));
            var Gt = G.transpose();
            var u = Gt.multiply(G.multiply(Gt).inverse()).multiply(y);
            return u;
        }
    },

    power : function(matrice,pow){
        var res=matrice;
        for(var i= 1;i<pow;i++){
            res=res.multiply(matrice);
        }
        return res;
    }

};




