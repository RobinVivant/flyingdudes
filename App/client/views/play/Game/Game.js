/*
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
            cof: 0.9,
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
            cof : 0.9,
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

        fyd.dude.harmsAngleConstraint = fyd.physics.rcm.angleConstraint(
            fyd.dude.hands.getShape(),
            fyd.dude.bodyTop.getShape(),
            fyd.dude.bodyBot.getShape(),
            0.001,
            Math.PI);

        fyd.dude.legsAngleConstraint = fyd.physics.rcm.angleConstraint(
            fyd.dude.bodyTop.getShape(),
            fyd.dude.bodyBot.getShape(),
            fyd.dude.feet.getShape(),
            0.001,
            Math.PI);

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
                        c.bodyB,
                        0.5,
                        2*r_tmp
                    );
                    fyd.launched = false;

                    break;
                }
            }
        });

        fyd.dude.bodyTop.follow();

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
                var coef = 0.02;
                if( fyd.rope.edge.getShape().state.vel.get(0) < 0 )
                    x = -1;
                if( fyd.rope.edge.getShape().state.vel.get(1) < 0 )
                    x = -1;
                fyd.rope.edge.getShape().applyForce( Physics.vector(coef*x, coef) );
                fyd.dude.feet.getShape().applyForce( Physics.vector(coef*x, coef) );
            }
            fyd.physics.world.step( time );
        });


        // start the ticker
        Physics.util.ticker.start();

        Session.set('scriptsLoaded', true);
    },

    update : function() {

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

*/