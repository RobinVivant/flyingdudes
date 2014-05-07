
Circle = function(I) {

    var self = {
        shape : new p2.Circle(I.radius/fyd.gfxScaleFactor || 1),
        body : new p2.Body({
            mass: I.mass || 0,
            position:[
                I.x/fyd.gfxScaleFactor || 0,
                (fyd.cfg.world.height-I.y)/fyd.gfxScaleFactor || 0]
        }),
        sprite : fyd.gfx.add.sprite(I.x || 0, I.y || 0, 'circle'),
        sleepCallback : function(){}
    };

    self.sprite.width = 2*I.radius || 1;
    self.sprite.height = 2*I.radius || 1;

    self.body.allowSleep = true;
    self.body.sleepSpeedLimit = fyd.phx.sleepSpeedLimit;
    self.body.sleepTimeLimit = fyd.phx.sleepTimeLimit;

    self.body.on("sleep",function(event){
        if( typeof self.sleepCallback === 'function' )
            self.sleepCallback();
    });

    if(I.fixed)
        self.body.motionState = p2.Body.KINEMATIC;

    self.sprite.anchor.setTo(0.5, 0.5);
    self.body.addShape(self.shape);
    fyd.phx.addBody(self.body);

    fyd.ticker.subscribe(function(time, delta){
        self.sprite.x = self.body.position[0]*fyd.gfxScaleFactor;
        self.sprite.y = fyd.cfg.world.height-(self.body.position[1]*fyd.gfxScaleFactor);
        self.sprite.angle = -self.body.angle*fyd.gfxScaleFactor;
    });

    return {
        getShape : function(){
            return self.shape;
        },
        getBody : function(){
            return self.body;
        },
        getSprite : function(){
            return self.sprite;
        },

        follow: function () {
            fyd.gfx.camera.follow(self.sprite, Phaser.Camera.FOLLOW_TOPDOWN);
        },
        onSleep : function( callback ){
            self.sleepCallback = callback;
        },
        setDistanceTo : function(element, distance){
            var c = new p2.DistanceConstraint(self.body,element.getBody(), distance/fyd.gfxScaleFactor);
            fyd.phx.addConstraint(c);
            return c;
        }
    };
}
