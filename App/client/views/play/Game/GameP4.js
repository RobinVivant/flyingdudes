
Session.set('scriptsLoaded', false);


Fyd = function(element, config){

    var self = this;

    $.getScript("/js/sylvester.js", function(){

        // masse
        self.h = 100;
        self.m = 70;
        self.dudePos = $M([
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

        self.phaser = new Phaser.Game(800, 600, Phaser.CANVAS, element, self);

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

        this.loadLevel();

        Session.set('scriptsLoaded', true);

        ticker.start();

    },

    update : function () {
        if( Session.get('scriptsLoaded') == false )
            return;

        if( this.counter >= this.h)
            return;

        var a_x = this.cmd.e(this.counter,1);
        var a_y = this.cmd.e(this.counter+1,1)+ this.gravity/this.erg;

        var Un = $M([
            [a_x],
            [a_y-this.gravity/this.erg]
        ]);


        this.dudePos= this.Ad.multiply(this.dudePos).add(this.Bd.multiply(Un));

        this.dude.body.x = this.dudePos.e(1, 1);
        this.dude.body.y = this.dudePos.e(3, 1);

console.log(this.dude.body.x, this.dude.body.y),

        this.counter+=2;
    },

    render: function (){
        //this.phaser.debug.text(this.cmd.e(counter, 1), 32, 32);
        ////this.phaser.debug.text(this.cmd.e(counter, ), 32, 50);

    },

    whenMouseDown : function(time, delta) {


    },

    onMouseUp : function(event) {


    },

    onMouseDown : function(event){

    },

    destroy : function(){
        ticker.stop();
        this.phaser.destroy();
    },

    loadLevel : function(){

        ticker.subscribe(this.whenMouseDown);

        this.dude = this.phaser.add.sprite(this.cfg.world.width/2, this.cfg.world.height/2, 'player');
        this.dude.scale.set(0.5);
        this.dude.collideWorldBounds = true;
        this.phaser.physics.arcade.enable(this.dude);

        this.phaser.camera.follow(this.dude) ;

        this.cmd = this.BoucleOuverte(
            [this.cfg.world.width/2, this.cfg.world.height/2],
            [this.cfg.world.width/2-300, (this.cfg.world.height/2-100)]
        );

    },

    jump : function(){

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
        ]); //lld('c');

        // Calcul de la matrice de gouvernabilité G
        var G = this.Bd;
        for (var n = 1; n <= this.h-1; n++ ) {
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
            var dimensionsU = u.dimensions();

            // number of rows are the number of commands


            // vecteur des commandes ax et ay des reacteurs
            /*
             var a = u;
             for (var i = 1; i <= h; i++) {
             a[2*n] = a[2*n] + gravity/erg;
             }
             */
            // pour avoir sous forme d'un tableau
            return u;
        }
    }

};




