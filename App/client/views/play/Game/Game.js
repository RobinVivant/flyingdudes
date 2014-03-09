
Session.set('phaserLoaded', false);


fyd = {
    catchFlag : false,
    launchVelocity : 0,
    launched : false,
    phaser : {},

    preload : function() {
        fyd.phaser.load.image('background','assets/sprites/starfield.jpg');
        fyd.phaser.load.image('player','assets/sprites/the_dude.png');
        fyd.phaser.load.image('analog', 'assets/sprites/fusia.png');
    },

    create : function() {

        fyd.physics = {};
        fyd.physics.world = Physics();

        fyd.physics.bounds = Physics.aabb(0, 0, fyd.world.width, fyd.world.height);

        fyd.physics.world.add( Physics.behavior('edge-collision-detection', {
            aabb: fyd.physics.bounds,
            restitution: 0.3
        }) );

        // ensure objects bounce when edge collision is detected
        fyd.physics.world.add( Physics.behavior('body-impulse-response') );

        fyd.physics.world.add( Physics.behavior('body-collision-detection') );

        fyd.physics.world.add( Physics.behavior('sweep-prune') );


        // subscribe to ticker to advance the simulation
        Physics.util.ticker.subscribe(function( time, dt ){
            fyd.physics.world.step( time );
        });

        var gravity = Physics.behavior('constant-acceleration', {
            acc: { x : 0, y: 0.0004 } // this is the default
        });

        //world.add( Physics.behavior('newtonian', { strength: .5 }) );

        fyd.physics.world.add( gravity );

        fyd.physics.rcm = Physics.behavior('rigid-constraint-manager');
        fyd.physics.world.add( fyd.physics.rcm );

        fyd.physics.center = Physics.body('circle', {
            // anchor
            x: fyd.world.width/2,
            y: fyd.world.width/2,
            mass : 40,
            restitution : 0,
            fixed : true,
            radius:0
        });
        fyd.physics.world.add(fyd.physics.center);

        fyd.physics.rope = Physics.body('circle', {
            // anchor
            radius : 4,
            mass : 10,
            restitution : 0
        });
        fyd.physics.world.add(fyd.physics.rope);

        fyd.phaser.world.setBounds(0, 0, fyd.world.width, fyd.world.height);
        fyd.phaser.add.tileSprite(0, 0, fyd.world.width, fyd.world.height, 'background');

        fyd.centerMobile = fyd.phaser.add.graphics(0,0);
        fyd.centerMobile.beginFill(0x049e0c);
        fyd.centerMobile.drawRect(fyd.world.width/2-25, fyd.world.height/2-25, 50, 50);

        fyd.analog = fyd.phaser.add.sprite(fyd.world.width/2, fyd.world.height/2, 'analog');
        fyd.analog.width = 8;
        fyd.analog.alpha = 1;
        fyd.analog.anchor.setTo(0.5, 0.0);
        fyd.analog.height = fyd.ropeLength;

        fyd.player = new Player({
            spriteId : 'player',
            width : fyd.world.width/2,
            height : fyd.world.height/2
        });
        fyd.player.setWidth( fyd.player.getWidth()*0.2);
        fyd.player.setHeight( fyd.player.getHeight()*0.2);
        fyd.player.enablePhysics(true);
        fyd.player.getSprite().anchor.setTo(0.5, 0);

        fyd.physics.rcm.constrain( fyd.physics.rope, fyd.physics.center, fyd.ropeLength );
        fyd.physics.ropeConstraint = fyd.physics.rcm.constrain( fyd.player.getBody(), fyd.physics.rope, 4.5 );

        fyd.phaser.input.mouse.mouseUpCallback = fyd.inputUp;
        fyd.player.follow();

        // start the ticker
        Physics.util.ticker.start();

        Session.set('scriptsLoaded', true);
    },

    update : function() {

         var distance = fyd.phaser.physics.distanceToXY(fyd.player.getSprite(), fyd.world.width/2, fyd.world.height/2);
        var theta = fyd.phaser.physics.angleToXY(fyd.player.getSprite(), fyd.world.width/2, fyd.world.height/2);

        if (distance <= fyd.ropeLength + 1)
        {
            fyd.analog.height = distance;
            fyd.analog.alpha = 0.5;
            fyd.analog.rotation = theta + Math.PI/2;
        }
        fyd.analog.alpha = 0.5;
    },

    inputDown : function() {

    },

    inputUp : function(event) {
        fyd.launch();

    },

    launch : function() {

        fyd.physics.rcm.remove(fyd.physics.ropeConstraint);
        fyd.launched = true;


    }

};

