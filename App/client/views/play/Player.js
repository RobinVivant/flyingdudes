
Player = function(spriteId, x, y, width, height){

    var player = {
        sprite : fyd.phaser.add.sprite(x, y, spriteId),

        body : Rectangle({
            // anchor
            x: x || 0,
            y: y || 0,
            mass : 1,
            restitution : 0.01,
            width : width || 0,
            height : height || 0
        }),

        physicsEnabled : false
    }

    Physics.util.ticker.subscribe(function( time, dt ){
        player.sprite.x = player.body.state.pos.get(0);
        player.sprite.y = player.body.state.pos.get(1);
    });

    player.enablePhysics = function(state){
        state && this.physicsEnabled ? fyd.world.add( this.body ) : fyd.world.remove( this.body );
        this.physicsEnabled = !this.physicsEnabled;
    };

    player.getWidth = function(){
        return this.sprite.width;
    };

    player.setWidth = function(width){
        this.sprite.width = width;
        this.body.setWidth(width);
    };

    player.getHeight = function(){
        return this.sprite.height;
    };
    player.setHeight = function(height){
        this.sprite.height = height;
        this.body.setHeight(width);
    };

    player.follow = function(){
        fyd.phaser.camera.follow(this.sprite, Phaser.Camera.FOLLOW_TOPDOWN);
    };

    player.unFollow = function(){
        fyd.phaser.camera.follow(null);
    };
}
