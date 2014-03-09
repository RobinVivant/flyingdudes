
Session.set('phaserLoaded', false);

var r_tmp = 10;

fyd = {
    catchFlag : false,
    launchVelocity : 0,
    launched : true,
    launching : false,
    phaser : {},

    preload : function() {
        fyd.phaser.load.image('background','assets/sprites/starfield.jpg');
        fyd.phaser.load.image('player','assets/sprites/the_dude.png');
        fyd.phaser.load.image('analog', 'assets/sprites/fusia.png');
        fyd.phaser.load.image('circle', 'assets/sprites/circle.png');
    },

    create : function() {

        //
        //PHYSICS
        //
        fyd.physics = {};
        fyd.physics.world = Physics();

        fyd.physics.bounds = Physics.aabb(0, 0, fyd.world.width, fyd.world.height);

        fyd.physics.world.add( Physics.behavior('edge-collision-detection', {
            aabb: fyd.physics.bounds,
            restitution: 0.3
        }) );

        fyd.physics.world.add( Physics.behavior('body-impulse-response') );
        fyd.physics.world.add( Physics.behavior('body-collision-detection') );
        fyd.physics.world.add( Physics.behavior('sweep-prune') );
        //world.add( Physics.behavior('newtonian', { strength: .5 }) );
        fyd.physics.world.add( Physics.behavior('constant-acceleration', {
            acc: { x : 0, y: 0.0004 } // this is the default
        }));

        fyd.physics.rcm = Physics.behavior('verlet-constraints', {
            iterations: 2
        });
        fyd.physics.world.add( fyd.physics.rcm );



        /*
        //          // anchor
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
*/

        // GRAPHICS
        //
        fyd.phaser.world.setBounds(0, 0, fyd.world.width, fyd.world.height);
        fyd.phaser.add.tileSprite(0, 0, fyd.world.width, fyd.world.height, 'background');


        // ROPE
        fyd.rope = {};
        fyd.rope.origin = new Circle({
            radius : 20,
            restitution : 0,
            x : fyd.world.width/2,
            y : fyd.world.height/2,
            fixed : true,
            alpha : 1
        });
        fyd.rope.edge = new Circle({
            group : "rope",
            radius : r_tmp,
            mass : 10,
            x : fyd.world.width/2,
            y : fyd.world.height/2,
            restitution : 0,
            alpha : 1
        });
        fyd.rope.constraint = fyd.physics.rcm.distanceConstraint(fyd.rope.origin.getShape(), fyd.rope.edge.getShape(), 0, fyd.ropeLength);

        // DUDE
        fyd.dude = {};
        fyd.dude.hands = new Circle({
            group : "dude",
            radius : r_tmp,
            restitution : 0,
            mass : 10,
            x : fyd.world.width/2,
            y : fyd.world.height/2,
            alpha : 1
        });
        fyd.dude.bodyTop = new Circle({
            radius : 1.1*r_tmp,
            restitution : 0,
            mass : 20,
            x : fyd.world.width/2,
            y : fyd.world.height/2,
            alpha : 1
        });
        fyd.dude.bodyBot = new Circle({
            radius : 1.1*r_tmp,
            restitution : 0,
            mass : 20,
            x : fyd.world.width/2,
            y : fyd.world.height/2,
            alpha : 1
        });
        fyd.dude.feet = new Circle({
            group : "dude",
            radius : r_tmp,
            restitution : 0,
            mass : 20,
            x : fyd.world.width/2,
            y : fyd.world.height/2,
            alpha : 1
        });

        fyd.dude.handsToBodyConstraint = fyd.physics.rcm.distanceConstraint(fyd.dude.hands.getShape(), fyd.dude.bodyTop.getShape(), 0.5, 60);
        fyd.dude.innerBodyConstraint = fyd.physics.rcm.distanceConstraint(fyd.dude.bodyTop.getShape(), fyd.dude.bodyBot.getShape(), 0.5, 50);
        fyd.dude.bodyToFeetConstraint = fyd.physics.rcm.distanceConstraint(fyd.dude.bodyBot.getShape(), fyd.dude.feet.getShape(), 0.5, 80);
        /*
        fyd.dude.harmsAngleConstraint = fyd.physics.rcm.angleConstraint(

            fyd.dude.hands.getShape(),
            fyd.dude.bodyTop.getShape(),
            fyd.dude.bodyBot.getShape(),
            1,
            90);

        fyd.dude.legsAngleConstraint = fyd.physics.rcm.angleConstraint(
            fyd.dude.bodyBot.getShape(),
            fyd.dude.bodyTop.getShape(),

            fyd.dude.feet.getShape(),
            0.5,
            130);
 */
        fyd.physics.world.subscribe('collisions:detected', function( data ){
            var c;
            for (var i = 0, l = data.collisions.length; i < l; i++){
                c = data.collisions[ i ];
                if(     c.bodyA.options.group == "rope"
                    &&  c.bodyB.options.group == "dude"){

                    if( fyd.launching || !fyd.launched )
                        break;

                    fyd.dude.handsToRopeConstraint = fyd.physics.rcm.distanceConstraint(
                        c.bodyA,
                        c.bodyA,
                        0.5,
                        2*r_tmp
                    );
                    fyd.launched = false;

                    break;
                }
            }
        });



        fyd.dude.bodyTop.follow();
        /*
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
*/

        fyd.phaser.input.mouse.mouseUpCallback = fyd.inputUp;

        fyd.phaser.input.keyboard.onUpCallback = function(event){
            if( event.keyCode == 13  && fyd.launched ){
                fyd.dude.handsToRopeConstraint = fyd.physics.rcm.distanceConstraint(
                    fyd.dude.hands.getShape(),
                    fyd.rope.edge.getShape(),
                    0.5,
                    2*r_tmp
                );
                fyd.launched = false;
            }
        }

        Physics.util.ticker.subscribe(function( time, dt ){
            if( fyd.phaser.input.keyboard.isDown(32) ){ // spacebar
                var x = 1;
                var coef = 0.01;
                if( fyd.rope.edge.getShape().state.vel.get(0) < 0 )
                    x = -1;
                if( fyd.rope.edge.getShape().state.vel.get(1) < 0 )
                    x = -1;
                fyd.rope.edge.getShape().applyForce( Physics.vector(coef*x, coef) );
            }
            fyd.physics.world.step( time );
        });


        // start the ticker
        Physics.util.ticker.start();

        Session.set('scriptsLoaded', true);
    },

    update : function() {
/*
         var distance = fyd.phaser.physics.distanceToXY(fyd.player.getSprite(), fyd.world.width/2, fyd.world.height/2);
        var theta = fyd.phaser.physics.angleToXY(fyd.player.getSprite(), fyd.world.width/2, fyd.world.height/2);

        if (distance <= fyd.ropeLength + 1)
        {
            fyd.analog.height = distance;
            fyd.analog.alpha = 0.5;
            fyd.analog.rotation = theta + Math.PI/2;
        }
        fyd.analog.alpha = 0.5;
        */
    },

    inputDown : function() {

    },

    inputUp : function(event) {
        fyd.launch();

    },

    launch : function() {

        if( fyd.launched )
            return;

        fyd.physics.rcm.remove(fyd.dude.handsToRopeConstraint);

        fyd.launching = true;
        fyd.launched = true;

        setTimeout(function(){
            fyd.launching = false;
        },500)

    }

};

