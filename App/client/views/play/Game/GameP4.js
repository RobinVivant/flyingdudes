Session.set('scriptsLoaded', false);

const aps = 0.5;
var m2p = 7;
var augmentFuel = 1000;
Fyd = function(element, config){

    var self = this;

    $.getScript("/js/sylvester.js", function(){

        // masse
        self.h = 50;
        self.dudeState = null;
        self.ve = 45*m2p; // vitesse appliquee par le joueur - ve = puissance
        self.mfuel = 1 * augmentFuel;
        self.mvide = 50;
        self.m  = self.mvide + self.mfuel / augmentFuel ;
        self.erg = self.ve/self.m; // note epsilon en cours
        self.gravity = 9.8*m2p; //*7 ?
        self.Te = 0.04;
        self.counter = 0;
        self.maxThrust = 10*m2p;

        self.TargetsCoordinates = [500,250,800,200,1300,500,1800,300,2400,350,2900,400];
        self.TargetsReached = 0;
        self.nbTargets = 6;
        self.groupSpriteTargets;
        self.user_highscore = 1000;
        self.autoModeHighscore = 1000;
        self.highscoreChanged = false;

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

        self.btn_reset = null;
        self.lbl_infos = null;
        self.lbl_highscore = null;
        self.lbl_targetsReached = null;
        self.lbl_autoModeHighScore = null;
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

        self.autoMode = {isLaunched:false, counter:0, nbTargets:6};

        self.phaser = new Phaser.Game(config.canvas.width, config.canvas.height, Phaser.CANVAS, element, self);

    });

};

Fyd.prototype = {

    preload : function(){
        this.phaser.load.image('background','assets/sprites/background.png');
        this.phaser.load.image('player','assets/sprites/the_dude.png');
        this.phaser.load.image('analog', 'assets/sprites/fusia.png');
        this.phaser.load.image('circle', 'assets/sprites/circle.png');
        this.phaser.load.image('quille', 'assets/sprites/quille.png');
        this.phaser.load.spritesheet('btn_reset', 'assets/reset-button.png', 125, 52);
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

        this.phaser.physics.arcade.overlap(this.dude, this.groupSpriteTargets, this.actionOnCollision, null, this);

        if (this.autoMode.isLaunched) {
            if (this.autoMode.counter != this.autoMode.nbTargets*2) {
                if (!this.dataBoucleOuverte.isLaunched) {
                    this.dataBoucleOuverte.isLaunched = true;
                    this.BoucleOuverte(
                        this.dudeState,
                        [this.TargetsCoordinates[this.autoMode.counter], -this.TargetsCoordinates[this.autoMode.counter + 1]]
                    );
                }
            }
            else {
                this.autoMode.isLaunched = false;
                this.autoMode.counter = 0;
                if (this.autoModeHighscore > this.cConso.toPrecision(4)) {
                    this.lbl_autoModeHighScore.text = "Score du mode auto : " + this.cConso.toPrecision(4);
                    this.autoModeHighscore = this.cConso.toPrecision(4);
                    this.highscoreChanged = true;
                }
            }
        }

        if(this.phaser.input.activePointer.isDown) {
            if(!this.dataBoucleOuverte.isLaunched) {
                this.dataBoucleOuverte.isLaunched = true;
                this.BoucleOuverte(
                    this.dudeState,
                    [this.phaser.input.mousePointer.worldX, -this.phaser.input.mousePointer.worldY]
                );
            }
        }

        if(!this.dataBoucleOuverte.isRunning) {

            // A little bit better
            if (this.cursors.right.isDown && this.cursors.up.isDown) {
                this.aCom.y = Math.abs(this.maxThrust) > Math.abs(this.aCom.y) ? this.aCom.y + aps : this.maxThrust;
                this.aCom.x = Math.abs(this.maxThrust) > Math.abs(this.aCom.x) ? this.aCom.x + aps : this.maxThrust;
            }

            // A little bit better
            if (this.cursors.left.isDown && this.cursors.up.isDown) {
                this.aCom.y = Math.abs(this.maxThrust) > Math.abs(this.aCom.y) ? this.aCom.y + aps : this.maxThrust;
                this.aCom.x = Math.abs(this.maxThrust) > Math.abs(this.aCom.x) ? this.aCom.x - aps : -this.maxThrust;
            }

            if (this.cursors.left.isDown) {
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
            }
            else {
                this.dataBoucleOuverte.isRunning = false;
                this.dataBoucleOuverte.isLaunched = false;
                this.autoMode.counter+=2;
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

        var gr;
        if (this.aCom.x + this.aCom.y != 0) {
            gr = Math.sqrt(this.aCom.x * this.aCom.x + Math.pow(this.aCom.y + this.gravity, 2))
        }
        else {
            gr = 0;
        }
        this.cConso += (gr / this.erg) * this.Te;
        this.mfuel -= (gr / this.erg) * this.Te;

        this.lbl_infos.text = "Position : \n     x : " + this.dudeState.e(1,1).toPrecision(4) + "\n     y : " + this.dudeState.e(3,1).toPrecision(4) + "\n" +
            "Carburant consommé : " + this.cConso.toPrecision(4) + "\nCarburant restant : " + this.mfuel.toPrecision(8);

        this.lbl_targetsReached.text = "Quilles : " + this.TargetsReached + "/6";

        if (!this.autoMode.isLaunched) {
            if (!this.highscoreChanged) {
                if (this.TargetsReached == 6) {
                    if (this.user_highscore > this.cConso.toPrecision(4)) {
                        this.lbl_highscore.text = "Tom meilleur score : " + this.cConso.toPrecision(4);
                        this.user_highscore = this.cConso.toPrecision(4);
                    }
                }
            }
        }
    },

    observState : function() {

        if (this.mfuel > 0) {
            this.m = this.mvide + this.mfuel / augmentFuel;  // masse totale
        }
        else {
            this.m = this.mvide;
        }

        this.erg = this.ve/this.m; // epsilon
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

    loadLevel : function(){

        //this.btn_reset = this.phaser.add.button(650, 550, 'btn_reset', this.actionOnReset, this,0,0,0);
        //this.btn_reset.fixedToCamera = true;

        this.dude = this.phaser.add.sprite(100, this.cfg.world.height/2, 'player');
        this.dude.scale.set(0.5);

        this.phaser.physics.enable(this.dude, Phaser.Physics.ARCADE);
        this.dude.body.collideWorldBounds = true;
        //this.phaser.physics.arcade.gravity.y = 100;

        this.dude.body.anchor = 0.5;
        this.dudeState = $M([[this.dude.body.x],[100],[-this.dude.body.y],[50]]);

        this.observState();

        var style = {font : "14px Arial", fill: "White", align: "left"};
        this.lbl_infos = this.phaser.add.text(100,65,
                "Position\n\tx : " + this.dudeState.e(1,1) + "\n\ty : " + this.dudeState.e(3,1), style);
        this.lbl_infos.anchor.set(0.5);
        this.lbl_infos.fixedToCamera = true;

        var style2 = {font : "14px Arial", fill: "Black", align: "right"};
        this.lbl_shortcuts = this.phaser.add.text(460,510,
            "Touche A : mode auto (boucle ouverte)\nTouche R : Reset\nFlèches pour se déplacer avec les réacteurs\nClic pour déplacer le dude grâce à la boucle ouverte\n",
            style2);
        this.lbl_shortcuts.fixedToCamera = true;

        var style3 = {font : "20px Arial", fill: "Brown", align: "left"};
        this.lbl_highscore = this.phaser.add.text(550,40, "Ton meilleur score : 0",style3);
        this.lbl_highscore.fixedToCamera = true;

        var style4 = {font : "20px Arial", fill: "Brown", align: "left"};
        this.lbl_targetsReached = this.phaser.add.text(10,550, "Quilles : 0/6",style4);
        this.lbl_targetsReached.fixedToCamera = true;

        var style5 = {font : "20px Arial", fill: "Red", align: "left"};
        this.lbl_autoModeHighScore = this.phaser.add.text(550,80, "Score du mode auto : 0",style5);
        this.lbl_autoModeHighScore.fixedToCamera = true;

        this.phaser.camera.follow(this.dude);

        this.groupSpriteTargets = this.phaser.add.group();

        this.dudeTarget = this.groupSpriteTargets.create(this.TargetsCoordinates[0],this.TargetsCoordinates[1],'quille');
        this.dudeTarget.scale.set(0.13);
        this.phaser.physics.enable(this.dudeTarget, Phaser.Physics.ARCADE);
        this.dudeTarget.body.anchor = 0.5;


        this.dudeTarget2 = this.groupSpriteTargets.create(this.TargetsCoordinates[2],this.TargetsCoordinates[3],'quille');
        this.dudeTarget2.scale.set(0.13);
        this.phaser.physics.enable(this.dudeTarget2, Phaser.Physics.ARCADE);
        this.dudeTarget2.body.anchor = 0.5;

        this.dudeTarget3 = this.groupSpriteTargets.create(this.TargetsCoordinates[4],this.TargetsCoordinates[5],'quille');
        this.dudeTarget3.scale.set(0.13);
        this.phaser.physics.enable(this.dudeTarget3, Phaser.Physics.ARCADE);
        this.dudeTarget3.body.anchor = 0.5;

        this.dudeTarget4 = this.groupSpriteTargets.create(this.TargetsCoordinates[6],this.TargetsCoordinates[7],'quille');
        this.dudeTarget4.scale.set(0.13);
        this.phaser.physics.enable(this.dudeTarget4, Phaser.Physics.ARCADE);
        this.dudeTarget4.body.anchor = 0.5;

        this.dudeTarget5 = this.groupSpriteTargets.create(this.TargetsCoordinates[8],this.TargetsCoordinates[9],'quille');
        this.dudeTarget5.scale.set(0.13);
        this.phaser.physics.enable(this.dudeTarget5, Phaser.Physics.ARCADE);
        this.dudeTarget5.body.anchor = 0.5;

        this.dudeTarget6 = this.groupSpriteTargets.create(this.TargetsCoordinates[10],this.TargetsCoordinates[11],'quille');
        this.dudeTarget6.scale.set(0.13);
        this.phaser.physics.enable(this.dudeTarget6, Phaser.Physics.ARCADE);
        this.dudeTarget6.body.anchor = 0.5;

        this.phaser.input.keyboard.addKey(Phaser.Keyboard.R)
            .onDown.add(this.actionOnReset, this);
        this.phaser.input.keyboard.addKey(Phaser.Keyboard.A)
            .onDown.add(this.actionOnAutoMode, this);

        this.timer = this.game.time.events.loop(this.Te*1000,this.update,this);
    },

    actionOnReset : function() {
        this.cConso  = 0;
        this.mfuel = augmentFuel;
        this.dudeState = $M([100,[50],[-300],[0]]);

        this.groupSpriteTargets.getAt(0).reset(this.TargetsCoordinates[0], this.TargetsCoordinates[1]);
        this.groupSpriteTargets.getAt(1).reset(this.TargetsCoordinates[2], this.TargetsCoordinates[3]);
        this.groupSpriteTargets.getAt(2).reset(this.TargetsCoordinates[4], this.TargetsCoordinates[5]);
        this.groupSpriteTargets.getAt(3).reset(this.TargetsCoordinates[6], this.TargetsCoordinates[7]);
        this.groupSpriteTargets.getAt(4).reset(this.TargetsCoordinates[8], this.TargetsCoordinates[9]);
        this.groupSpriteTargets.getAt(5).reset(this.TargetsCoordinates[10], this.TargetsCoordinates[11]);

        this.TargetsReached = 0;
        this.highscoreChanged = false;
    },

    actionOnCollision : function(dude, target) {
        target.kill();
        this.TargetsReached ++;
    },

    actionOnAutoMode : function() {
        if (!this.autoMode.isLaunched) {
            this.cConso = 0;
            this.mfuel = augmentFuel;
            this.dudeState = $M([100, [50], [-300], [0]]);
            this.autoMode.isLaunched = true;
        }
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




