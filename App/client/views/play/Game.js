
Session.set('phaserLoaded', false);


fyd = {
    catchFlag : false,
    launchVelocity : 0,
    launched : false,

    preload : function() {
        fyd.phaser.load.image('background','assets/sprites/starfield.jpg');
        fyd.phaser.load.image('player','assets/sprites/the_dude.png');
        fyd.phaser.load.image('analog', 'assets/sprites/fusia.png');
    },

    create : function() {

        Physics(function(world){

            world.add( Physics.behavior('constant-acceleration') );

            fyd.physics = {};
            fyd.physics.world = world;
            fyd.physics.bounds = Physics.aabb(0, 0, fyd.world.width, fyd.world.height);

            world.add( Physics.behavior('edge-collision-detection', {
                aabb: fyd.physics.bounds,
                restitution: 0.3
            }) );

            // ensure objects bounce when edge collision is detected
            world.add( Physics.behavior('body-impulse-response') );

            world.add( Physics.behavior('body-collision-detection') );

            world.add( Physics.behavior('sweep-prune') );


            // subscribe to ticker to advance the simulation
            Physics.util.ticker.subscribe(function( time, dt ){
                world.step( time );
            });

            var gravity = Physics.behavior('constant-acceleration', {
                acc: { x : 0, y: 0.0002 } // this is the default
            });

            //world.add( Physics.behavior('newtonian', { strength: .5 }) );

            world.add( gravity );

            fyd.physics.rcm = Physics.behavior('rigid-constraint-manager');
            world.add( fyd.physics.rcm );




            fyd.physics.center = Physics.body('convex-polygon', {
                // anchor
                x: fyd.world.width/2,
                y: fyd.world.width/2,
                mass : 40,
                restitution : 0.1,
                fixed : true,
                vertices: [
                    { x: 0, y: 0 },
                    { x: 50, y: 0 },
                    { x: 50, y : 50 },
                    { x: 0, y : 50 }
                ]
            });

            world.add(fyd.physics.center);



            // start the ticker
            Physics.util.ticker.start();

        });

        fyd.phaser.world.setBounds(0, 0, fyd.world.width, fyd.world.height);
        fyd.phaser.add.tileSprite(0, 0, fyd.world.width, fyd.world.height, 'background');

        fyd.centerMobile = fyd.phaser.add.graphics(0,0);
        fyd.centerMobile.beginFill(0x049e0c);
        fyd.centerMobile.drawRect(fyd.world.width/2-25, fyd.world.height/2-25, 50, 50);

        fyd.analog = fyd.phaser.add.sprite(fyd.world.width/2, fyd.world.height/2, 'analog');
        fyd.analog.width = 8;
        //fyd.analog.rotation = 220;
        fyd.analog.alpha = 1;
        fyd.analog.anchor.setTo(0.5, 0.0);
        fyd.analog.height = fyd.ropeLength/2;
        fyd.analog.body.maxAngular = 500;
        //  Apply a drag otherwise the sprite will just spin and never slow down
        fyd.analog.body.angularDrag = 50;


        fyd.player = new Player('player', fyd.world.width/2, fyd.world.height/2);
        fyd.player = fyd.phaser.add.sprite(fyd.world.width/2, fyd.world.height/2, 'player');
        fyd.player.setWidth( fyd.player.getWidth()*0.2);
        fyd.player.setHeight( fyd.player.getHeight()*0.2);
        fyd.player.sprite.anchor.setTo(0.5, 0.5);

        fyd.physics.ropeConstraint = fyd.physics.rcm.constrain( fyd.player.body, fyd.physics.center, fyd.ropeLength );

        // Enable input.
        fyd.phaser.input.mouse.mouseUpCallback = fyd.inputUp;

        // this tween is to make the camera return to left side of world when done launching
        // so it is not used until then
        /*
        fyd.myTween = fyd.phaser.add.tween(fyd.player).to({x: 150}, 5000, Phaser.Easing.Linear.None);
        fyd.myTween.onComplete.add(fyd.reappear, this);
        */
        fyd.phaser.camera.follow(fyd.player, Phaser.Camera.FOLLOW_TOPDOWN);



        Session.set('scriptsLoaded', true);
    },

    update : function() {

        distance = fyd.phaser.physics.distanceToXY(fyd.player, fyd.world.width/2, fyd.world.height/2);
        theta = fyd.phaser.physics.angleToXY(fyd.player, fyd.world.width/2, fyd.world.height/2);

        if (distance <= fyd.ropeLength + 1)
        {
            fyd.analog.height = distance;
            fyd.analog.alpha = 0.5;
            fyd.analog.rotation = theta + Math.PI/2;
        }
    },

    inputDown : function() {

        /*
         game.debug.renderText("Drag the sprite and release to launch", 32, 32, 'rgb(0,255,0)');
         game.debug.renderCameraInfo(game.camera, 32, 64);
         game.debug.renderSpriteCoords(player, 32, 150);
         game.debug.renderText("Launch Velocity: " + parseInt(launchVelocity), 550, 32, 'rgb(0,255,0)');
         */
    },

    inputUp : function(event) {
        fyd.launch();

    },

    launch : function() {

        fyd.physics.rcm.remove(fyd.physics.ropeConstraint);
        fyd.launched = true;
        fyd.analog.alpha = 0;
        //fyd.player.body.gravity.setTo(0, 180);
/*
        fyd.analog.alpha = 0;
        Xvector = (fyd.arrow.x - fyd.player.x)*3.8;
        Yvector = (fyd.arrow.y - fyd.player.y)*3.8;
        fyd.player.body.gravity.setTo(0,8);
        fyd.player.body.velocity.setTo(Xvector,Yvector);
        */

    }

};

