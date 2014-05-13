Session.set('scriptsLoaded', false);

const aps = 0.5;
var m2p = 7;
Fyd = function(element, config){

    var self = this;

    $.getScript("/js/sylvester.js", function(){

        // masse
        self.h = 50;
        self.dudeState = null;
        self.ve = 45*m2p; // vitesse appliquee par le joueur - ve = puissance
        self.mfuel = 10;
        self.mvide = 100;
        self.m  = self.mvide + self.mfuel;
        self.erg = self.ve/self.m; // note epsilon en cours
        self.gravity = 9.8*m2p; //*7 ?
        self.Te = 0.04;
        self.counter = 0;
        self.maxThrust = 5*m2p;

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

        self.lbl_infos = null;
        self.cursors = null;

        self.Ad = $M([
            [1,0.0396027,0,0],
            [0,0.9801987,0,0],
            [0,0,1,0.0396027],
            [0,0,0,0.9801987] ]);

        self.Bd = $M([
            [(self.erg*Math.pow(self.Te,2))/2,0],
            [self.erg*self.Te,0],
            [0,(self.erg*Math.pow(self.Te,2))/2],
            [0,self.erg*self.Te]]);

        //commande des reacteurs
        self.aCom = {x:0,y:0};

        self.cConso=0;

        self.dataBoucleOuverte = {counter:0,uCom:null, isRunning:false, isLaunched:false};

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

        this.setBounds(this.cfg.world.width, this.cfg.world.height);
        this.loadLevel();
        this.cursors = this.phaser.input.keyboard.createCursorKeys();
        Session.set('scriptsLoaded', true);
    },

    update : function () {
        if( Session.get('scriptsLoaded') == false )
            return;

        this.observState();

        if(this.phaser.input.activePointer.isDown) {
            if(!this.dataBoucleOuverte.isLaunched) {
                this.dataBoucleOuverte.isLaunched = true;
                console.log("LAUNCHED");
                this.BoucleOuverte(
                    this.dudeState,
                    [this.phaser.input.mousePointer.x, -this.phaser.input.mousePointer.y]
                );
            }
        }

        //si il n'y a pas de commande en cours --> commande manuelle
        if(!this.dataBoucleOuverte.isRunning) {

            if (this.dude.body.onFloor()) {
                if (this.cursors.left.isDown) {
                    this.aCom.y = 0;
                    this.aCom.x = Math.abs(this.maxThrust) > Math.abs(this.aCom.x) ? this.aCom.x - aps : -this.maxThrust;

                }
                else if (this.cursors.right.isDown) {
                    this.aCom.y = 0;
                    this.aCom.x = Math.abs(this.maxThrust) > Math.abs(this.aCom.x) ? this.aCom.x + aps : this.maxThrust;

                }
            }

            if (this.cursors.left.isDown) {
                this.dude.body.angle += 10;
                this.aCom.y = 0;
                this.aCom.x = Math.abs(this.maxThrust) > Math.abs(this.aCom.x) ? this.aCom.x - aps : -this.maxThrust;
            }
            else if (this.cursors.right.isDown) {
                this.aCom.y = 0;
                this.aCom.x = Math.abs(this.maxThrust) > Math.abs(this.aCom.x) ? this.aCom.x + aps : this.maxThrust;
            }
            else if (this.cursors.up.isDown) {
                this.aCom.x = 0;
                this.aCom.y = Math.abs(this.maxThrust) > Math.abs(this.aCom.y) ? this.aCom.y + aps : this.maxThrust;
            }

            else {
                this.aCom.x = 0;
                this.aCom.y = 0;
                this.dude.animations.stop();
            }
        }
        // Commande en Cours : calcul
        else {
            if (this.dataBoucleOuverte.counter < this.h) {
                this.aCom.x = this.dataBoucleOuverte.uCom.e(this.dataBoucleOuverte.counter * 2 + 1, 1);
                this.aCom.y = this.dataBoucleOuverte.uCom.e(this.dataBoucleOuverte.counter * 2 + 2, 1) + this.gravity / this.erg;

                this.dataBoucleOuverte.counter += 1;
                //console.log(this.aCom.x+" "+this.aCom.y);
            }
            else {
                this.dataBoucleOuverte.isRunning = false;
                this.dataBoucleOuverte.isLaunched = false;
            }
        }


        var Un = $M([
            [this.aCom.x],
            [this.aCom.y - this.gravity / this.erg]
        ]);
        if (this.dude.body.onFloor() || this.dude.body.blocked.up) {
            this.dudeState = $M([
                [this.dudeState.e(1, 1)],
                [this.dudeState.e(2, 1)],
                [-this.dude.body.y],
                [0]
            ]);
            this.Bd = $M([
                [(this.erg * Math.pow(this.Te, 2)) / 2, 0],
                [this.erg * this.Te, 0],
                [0, 0],
                [0, 0]
            ]);
            this.Ad = $M([
                [1, 0.0396027, 0, 0],
                [0, 0.9801987, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 0]
            ]); //frottement : 0.5

            this.aCom.x = 0;
            this.aCom.y = 0;
            this.dude.animations.stop();

            this.dude.frame = 4;
        }
        this.dudeState = this.Ad.multiply(this.dudeState).add(this.Bd.multiply(Un));

        this.dude.body.x = this.dudeState.e(1, 1);
        this.dude.body.y = -this.dudeState.e(3, 1);

        var gr = this.aCom.x + this.aCom.y != 0 ? Math.sqrt(this.aCom.x * this.aCom.x + Math.pow(this.aCom.y + this.gravity, 2)) : 0;
        this.cConso += (gr / this.erg) * this.Te;
        this.mfuel -= (gr / this.erg) * this.Te;

        this.lbl_infos.text = "Position\n\tx : " + this.dudeState.e(1,1).toPrecision(4) + "\n\ty : " + this.dudeState.e(3,1).toPrecision(4) + "\n" +
            "Carburant consomme : " + this.cConso.toPrecision(4) + "\nCarburant restant : " + this.mfuel.toPrecision(4);
    },

    observState : function() {

        this.m = this.mvide + this.mfuel;  // masse totale
        this.erg = this.ve/this.m;          // noté epsilon dans le cours,
        //accélération horizontale = erg*ax, verticale erg*ay, erg ~= 0.5878
        this.Bd = $M([
            [(this.erg*Math.pow(this.Te,2))/2,0],
            [this.erg*this.Te,0],
            [0,(this.erg*Math.pow(this.Te,2))/2],
            [0,this.erg*this.Te] ]);
        this.Ad = $M([
            [1,0.0396027,0,0],
            [0,0.9801987,0,0],
            [0,0,1,0.0396027],
            [0,0,0,0.9801987] ]);
    },

    destroy : function(){
        this.phaser.destroy();
        Session.set('scriptsLoaded', false);
    },

    restart: function(matX){
        console.log("Dans restart");
        this.dudeState=matX;

        this.dude.body.x = this.dudeState.e(1, 1);
        this.dude.body.y = -this.dudeState.e(3, 1);

        this.timer.timer.start();
    },

    reset: function(){
        console.log("Dans reset");
        this.dudeState = $M([
            [this.cfg.world.width/2],[0],
            [-this.cfg.world.height/2],[0]]);

        this.dude.body.x = this.dudeState.e(1, 1);
        this.dude.body.y = -this.dudeState.e(3, 1);
    },


    loadLevel : function(){

        this.dude = this.phaser.add.sprite(this.cfg.world.width/2, this.cfg.world.height/2, 'player');
        this.dude.scale.set(0.5);

        this.phaser.physics.enable(this.dude, Phaser.Physics.ARCADE);
        this.dude.body.collideWorldBounds = true;
        //this.phaser.physics.arcade.gravity.y = 100;

        this.dudeState = $M([[this.dude.body.x],[0],[-this.dude.body.y],[0]]);

        this.observState();

        var style = {font : "14 Arial", fill: "White", align: "left"};
        this.lbl_infos = this.phaser.add.text(100,50,
                "Position\n\tx : " + this.dudeState.e(1,1) + "\n\ty : " + this.dudeState.e(3,1), style);
        this.lbl_infos.anchor.set(0.5);

        this.phaser.camera.follow(this.dude) ;

        this.timer = this.game.time.events.loop(this.Te*1000,this.update,this);
    },

    setBounds : function(width, height){
        this.bounds.tileMap = this.phaser.add.tileSprite(0, 0, width, height, 'background');
        this.phaser.world.setBounds(0, 0, width, height);
    },

    BoucleOuverte : function(posDude, goalPos) {

        this.dataBoucleOuverte.counter = 0;

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

            var y = Xh.subtract(this.power(this.Ad,this.h).multiply(posDude));
            var Gt = G.transpose();
            this.dataBoucleOuverte.uCom = Gt.multiply(G.multiply(Gt).inverse()).multiply(y);
            this.dataBoucleOuverte.isRunning = true;
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




