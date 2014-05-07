/**
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
            width : 800,
            height : 600
        },
        rayon : 250,
        step : 1/60,
        noiseAmount : 0,
        t0 : 0
    });
    $("#theDudeImg").hide();
};

Template.leroux.destroyed = function(){
    leroux.destroy();
    leroux = null;
    $("#theDudeImg").show();
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
                self.initPos.x-self.cfg.rayon,
                0,
                self.initPos.y,
                0
            ]),
            sprite : {},
            speed : 100
        };

        self.observer ={
            state : $V([
                self.initPos.x,
                0,
                self.initPos.y,
                0
            ]),
            sprite : {},
            speed : 1
        };

        self.theta = 0;

        self.phaser = new Phaser.Game(config.canvas.width, config.canvas.height, Phaser.CANVAS, element, self);
    });

};


Leroux.prototype = {

    preload : function(){
        this.phaser.load.image('background','assets/sprites/starfield.jpg');
        this.phaser.load.image('player','assets/sprites/the_dude.png');
        this.phaser.load.image('analog', 'assets/sprites/fusia.png');
        this.phaser.load.image('circle', 'assets/sprites/circle.png');
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

        this.analog = this.phaser.add.sprite(200, 450, 'analog');
        this.analog.width = 4;
        this.analog.rotation = 0;
        this.analog.alpha = 1;
        this.analog.anchor.setTo(0.5, 0.0);

        this.mobile.sprite = this.phaser.add.sprite(this.mobile.state.x, this.mobile.state.y, 'circle');
        this.mobile.sprite.anchor.setTo(0.5, 0.5);
        this.mobile.sprite.scale.set(0.025);
        this.mobile.initialState = this.mobile.state.dup();

        this.observer.sprite = this.phaser.add.sprite(this.observer.state.x, this.observer.state.y, 'circle');
        this.observer.sprite.anchor.setTo(0.5, 0.5);
        this.observer.sprite.scale.set(0.025);
        this.observer.initialState = this.observer.state.dup();



        ticker.subscribe(this.updateObserver);
        ticker.subscribe(this.updateMobile);

    },

    updateObserver: function () {
        var t = this.getT()*this.observer.speed;

        this.observer.state = this.observer.initialState.add(
            $V([Math.cos(t)*this.cfg.rayon, 0, Math.sin(t)*this.cfg.rayon, 0])
        );

        this.theta = Math.atan2(this.mobile.state.e(3) - this.observer.state.e(3), this.mobile.state.e(1) - this.observer.state.e(1));
        this.theta += Math.random()*this.cfg.noiseAmount;
    },

    updateMobile: function () {

        //this.mobile.state.vx += this.mobile.speed;

        var t = this.getT()*this.mobile.speed;

        this.mobile.state = this.mobile.initialState.add(
            $V([t, 0, 0, 0])
        );
    },

    update : function () {
        if( Session.get('scriptsLoaded') == false )
            return;


        this.observer.sprite.reset(this.observer.state.e(1), this.observer.state.e(3));
        this.mobile.sprite.reset(this.mobile.state.e(1), this.mobile.sprite.y = this.mobile.state.e(3));

        this.analog.reset(this.observer.sprite.x, this.observer.sprite.y);
        this.analog.rotation = this.phaser.physics.arcade.angleBetween(this.observer.sprite, this.mobile.sprite) - Math.PI/2;
        this.analog.height = this.phaser.physics.arcade.distanceBetween(this.observer.sprite, this.mobile.sprite);


    },

    render: function (){
        this.phaser.debug.text('Theta : ' + this.theta, 30, 30);

    },

    destroy : function(){
        ticker.stop();
        this.phaser.destroy();
        Session.set('scriptsLoaded', false);
    }


};



**/
