
Player = function (I) {

    var self = {
        // constructor args
        spriteId: "notFound",
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        // attributes
        sprite:{},
        body:{},
        physicsEnabled: true
    };

    $.extend(self, I);

    $.extend(self, {
        sprite : fyd.phaser.add.sprite(self.x, self.y, self.spriteId),
        body : Physics.body('circle', {
            // anchor
            x: self.x,
            y: self.y,
            mass: 1,
            restitution: 0,
            radius : 1
        })
    });

    // constructor
    Physics.util.ticker.subscribe(function (time, dt) {
        self.sprite.x = self.body.state.pos.get(0);
        self.sprite.y = self.body.state.pos.get(1);
    });

    // members
    return {
        getBody : function(){
            return self.body;
        },

        getSprite : function(){
            return self.sprite;
        },

        enablePhysics: function (state) {
            (state && self.physicsEnabled) ? fyd.physics.world.add(self.body) : fyd.physics.world.remove(self.body);
            self.physicsEnabled = !self.physicsEnabled;
        },

        getWidth: function () {
            return self.sprite.width;
        },

        setWidth: function (width) {
            self.sprite.width = width;
            ;
        },

        getHeight: function () {
            return self.sprite.height;
        },

        setHeight: function (height) {
            self.sprite.height = height;

        },

        follow: function () {
            fyd.phaser.camera.follow(self.sprite, Phaser.Camera.FOLLOW_TOPDOWN);
        },

        unFollow: function () {
            fyd.phaser.camera.follow(null);
        }
    };
}


