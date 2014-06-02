(function(){
    Session.set('scriptsLoaded', false);

    Template.leroux.helpers({
        scriptsLoaded: function() { return Session.get('scriptsLoaded'); }
    });

    Template.leroux.rendered = function(){
        leroux = new Leroux('game-canvas', {
            canvas : {
                width : 800,
                height : 600
            },
            world : {
                width : 3000,
                height : 3000
            },
            rayon : 250,
            step : 1/60,
            noiseAmount : 0,
            t0 : 0
        });
    };

    Template.leroux.destroyed = function(){
        leroux.destroy();
        leroux = null;
    };

    Leroux = function(element, config){

        var self = this;

        $.getScript("/js/sylvester.js", function(){

            self.cfg = config;

            self.curTime = 0;

            self.initPos = {
                x : config.world.width/2,
                y : config.world.height/2
            };

            self.mobile ={
                state : $V([
                        self.initPos.x-self.cfg.rayon/2,
                    0,
                    self.initPos.y,
                    0
                ]),
                predicted : {
                    state : $V([
                        0,
                        0,
                        0,
                        0
                    ]),
                    sprite : {}
                },
                sprite : {},
                speed : 30
            };

            self.observer ={
                state : $V([
                    self.initPos.x,
                    0,
                    self.initPos.y,
                    0
                ]),
                predictedPos : $V([
                    0,
                    0
                ]),
                sprite : {},
                speed : 5
            };

            self.methode = "globale";
            self.counterMesures = -4;
            self.C;
            self.tabC;
            self.tabY;
            self.X
            self.eps;

            self.theta = 0;

            self.phaser = new Phaser.Game(config.canvas.width, config.canvas.height, Phaser.CANVAS, element, self);
        });

    };

    Leroux.prototype = {

        preload : function(){
            this.phaser.load.image('background','assets/sprites/background.png');
            this.phaser.load.image('player','assets/sprites/the_dude.png');
            this.phaser.load.image('analog', 'assets/sprites/fusia.png');
            this.phaser.load.image('circle', 'assets/sprites/circle.png');
            this.phaser.load.image('quille', 'assets/sprites/quille.png');
        },

        create : function(){
            this.phaser.add.tileSprite(0, 0, this.cfg.world.width, this.cfg.world.height, 'background');
            this.phaser.world.setBounds(0, 0, this.cfg.world.width, this.cfg.world.height);

            this.loadLevel();

            this.t0 = this.phaser.time.lastTime;

            ticker.start(this);

            Session.set('scriptsLoaded', true);
        },

        getT : function(){
            return  this.phaser.time.elapsedSecondsSince(this.t0);
        },

        loadLevel : function(){

            /*
            this.analog = this.phaser.add.sprite(200, 450, 'analog');
            this.analog.width = 4;
            this.analog.rotation = 0;
            this.analog.alpha = 1;
            this.analog.anchor.setTo(0.5, 0.0);*/

            this.mobile.sprite = this.phaser.add.sprite(this.mobile.state.e(1), this.mobile.state.e(3), 'quille');
            this.mobile.sprite.anchor.setTo(0.5, 0.5);
            this.mobile.sprite.scale.set(0.2);
            this.mobile.initialState = this.mobile.state.dup();

            this.observer.sprite = this.phaser.add.sprite(this.observer.state.e(1), this.observer.state.e(3), 'player');
            this.observer.sprite.anchor.setTo(0.5, 0.5);
            this.observer.sprite.scale.set(0.7);
            this.observer.initialState = this.observer.state.dup();

            this.mobile.predicted.sprite = this.phaser.add.sprite(this.mobile.predicted.state.e(1), this.mobile.predicted.state.e(3), 'circle');
            this.mobile.predicted.sprite.anchor.setTo(0.5, 0.5);
            this.mobile.predicted.sprite.scale.set(0.03);

            this.phaser.camera.follow(this.mobile.sprite);

            ticker.subscribe(this.updateObserver);
            ticker.subscribe(this.updateMobile);

        },

        updateObserver: function () {

            var t = this.getT() * this.observer.speed;

            this.observer.state = this.observer.initialState.add(
                $V([Math.cos(t)*this.cfg.rayon, 0, Math.sin(t)*this.cfg.rayon, 0])
            );

            this.theta = Math.atan2(this.mobile.state.e(3) - this.observer.state.e(3), this.mobile.state.e(1) - this.observer.state.e(1));
            this.theta += Math.random() * this.cfg.noiseAmount;

            this.counterMesures++;
            if (this.methode == "globale") {
                if (this.counterMesures == 0) {
                    this.tabC = [Math.sin(this.theta), 0, 0, 0];

                    this.tabY = [Math.cos(this.theta) * this.observer.state.e(3) - Math.sin(this.theta) * this.observer.state.e(1), 0, 0, 0];
                }
                if (this.counterMesures == 1) {
                    this.tabC[1] = Math.sin(this.theta);
                    this.tabY[1] = Math.cos(this.theta) * this.observer.state.e(3) - Math.sin(this.theta) * this.observer.state.e(1);
                }
                if (this.counterMesures == 2) {
                    this.tabC[2] = -Math.cos(this.theta);
                    this.tabY[2] = Math.cos(this.theta) * this.observer.state.e(3) - Math.sin(this.theta) * this.observer.state.e(1);
                }
                if (this.counterMesures == 3) {
                    this.tabC[3] = -Math.cos(this.theta);
                    this.tabY[3] = Math.cos(this.theta) * this.observer.state.e(3) - Math.sin(this.theta) * this.observer.state.e(1);

                    this.C = $M([
                        [this.tabC[0]],
                        [this.tabC[1]],
                        [this.tabC[2]],
                        [this.tabC[3]]
                    ]);

                    this.Y = $M([
                        [this.tabY[0]],
                        [this.tabY[1]],
                        [this.tabY[2]],
                        [this.tabY[3]]
                    ]);

                    // Estimation des paramètres
                    this.Ct = this.C.transpose();

                    this.X = ((this.Ct.multiply(this.C)).inverse()).multiply(this.Ct).multiply(this.Y);
                    this.eps = Math.cos(this.theta) * this.observer.state.e(3) - Math.sin(this.theta) * this.observer.state.e(1)
                        + Math.sin(this.theta) * this.X.e(1) + Math.sin(this.theta) * this.X.e(2) - Math.cos(this.theta) * this.X.e(3)
                        - Math.cos(this.theta) * this.X.e(4);

                    console.log(this.eps);
                }
            }
            else {

                var distance =
                    (this.mobile.predicted.state.e(3) - this.observer.state.e(3)) * Math.cos(this.theta)
                    -
                    (this.mobile.predicted.state.e(1) - this.observer.state.e(1)) * Math.sin(this.theta);

                this.mobile.predicted.state =
                    this.mobile.predicted.state.add(
                        $V([Math.sin(this.theta),
                            0,
                            -Math.cos(this.theta),
                            0])
                            .x(distance));
            }

            if( this.phaser.input.keyboard.isDown(Phaser.Keyboard.ENTER) ){
                this.cfg.noiseAmount = 0.02;
            }else{
                this.cfg.noiseAmount = 0;
            }

        },

        updateMobile: function () {

            //this.mobile.state.vx += this.mobile.speed;

            var t = this.getT() * this.mobile.speed;
            //console.log(t);

            this.mobile.state = this.mobile.initialState.add(
                $V([t, 0, 0, 0])
            );

            if( this.phaser.input.keyboard.isDown(37) ){
                //left
                this.mobile.speed -= 0.2;
            }else if( this.phaser.input.keyboard.isDown(39) ){
                //right
                this.mobile.speed += 0.2;
            }
            //  this.mobile.speed
        },

        update : function () {
            if( Session.get('scriptsLoaded') == false )
                return;


            this.observer.sprite.reset(this.observer.state.e(1), this.observer.state.e(3));

            //console.log(this.mobile.state.e(1));
            this.mobile.sprite.reset(this.mobile.state.e(1), this.mobile.state.e(3));
            this.mobile.predicted.sprite.reset(this.mobile.predicted.state.e(1), this.mobile.predicted.state.e(3));

            /*
            this.analog.reset(this.observer.sprite.x, this.observer.sprite.y);
            this.analog.rotation = this.phaser.physics.arcade.angleBetween(this.observer.sprite, this.mobile.sprite) - Math.PI/2;
            this.analog.height = this.phaser.physics.arcade.distanceBetween(this.observer.sprite, this.mobile.sprite);*/


        },

        render: function (){
            this.phaser.debug.text('Theta : ' + this.theta, 30, 30);
            this.phaser.debug.text('Observer speed : ' + this.observer.speed, 30, 60);

        },

        destroy : function(){
            ticker.stop();
            this.phaser.destroy();
            Session.set('scriptsLoaded', false);
        }
    };
})();
