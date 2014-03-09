
Circle = function(I) {

    var self = {
        shape : Physics.body('circle', I),
        sprite : fyd.phaser.add.sprite(I.x || 0, I.y || 0, 'circle')
    };

    $.extend(self, I);

    self.sprite.width = 2*I.radius;
    self.sprite.height = 2*I.radius;
    self.sprite.anchor.setTo(0.5, 0.5);

    fyd.physics.world.add(self.shape);

    Physics.util.ticker.subscribe(function (time, dt) {
        self.sprite.x = self.shape.state.pos.get(0);
        self.sprite.y = self.shape.state.pos.get(1);
    });

    return {
        getShape : function(){
            return self.shape;
        },
        getSprite : function(){
            return self.sprite;
        },

        follow: function () {
            fyd.phaser.camera.follow(self.sprite, Phaser.Camera.FOLLOW_TOPDOWN);
        }
    };
}
