
Circle = function(I) {

    var self = {
        shape : new p2.Circle(I.radius/fyd.phxToGfxScaleFactor || 1),
        body : new p2.Body({ mass: I.mass || 0, position:[I.x/fyd.phxToGfxScaleFactor || 0, (fyd.cfg.world.height-I.y)/fyd.phxToGfxScaleFactor || 0] }),
        sprite : fyd.gfx.add.sprite(I.x || 0, I.y || 0, 'circle')
    };

    self.sprite.width = 2*I.radius || 1;
    self.sprite.height = 2*I.radius || 1;
    self.sprite.anchor.setTo(0.5, 0.5);

    self.body.addShape(self.shape);
    fyd.phx.addBody(self.body);

    fyd.ticker.subscribe(function(time, delta){
        self.sprite.x = self.body.position[0]*fyd.phxToGfxScaleFactor;
        self.sprite.y = fyd.cfg.world.height-(self.body.position[1]*fyd.phxToGfxScaleFactor);
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
        }
    };
}
