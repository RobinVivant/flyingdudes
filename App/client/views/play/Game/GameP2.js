
Session.set('phaserLoaded', false);

var r_tmp = 10;

function preload() {
    fyd.gfx.load.image('background','assets/sprites/starfield.jpg');
    fyd.gfx.load.image('player','assets/sprites/the_dude.png');
    fyd.gfx.load.image('analog', 'assets/sprites/fusia.png');
    fyd.gfx.load.image('circle', 'assets/sprites/circle.png');
}

function create() {

    fyd.phx = new p2.World({ gravity:[0,-9.82] });

    fyd.phx.solver.stiffness = 1e5;
    fyd.phx.solver.relaxation = 3;
    fyd.phx.solver.iterations = 20;

    fyd.phx.enableBodySleeping = true;
    fyd.phx.sleepSpeedLimit = 0.0001; // Body will feel sleepy if speed<1 (speed is the norm of velocity)
    fyd.phx.sleepTimeLimit = 1;


    fyd.ticker.subscribe(function(time, delta){
        fyd.phx.step(1/60.0, delta);
    });

    // NE PAS METTRE CES DEUX LIGNES PLUS LOIN
    fyd.setBounds(fyd.cfg.world.width, fyd.cfg.world.height);
    fyd.bounds.tileMap = fyd.gfx.add.tileSprite(0, 0, fyd.cfg.world.width, fyd.cfg.world.height, 'background');

    fyd.loadLevel();

    Session.set('scriptsLoaded', true);

    fyd.ticker.start();

}

function update() {

}

function render(){

}

fyd = {
    launched : true,
    launching : false,
    fps : 60.0,
    phxToGfxScaleFactor : 10.0,
    ticker : {},
    cfg : {},
    gfx : {},
    phx : {},

    init : function(element){
        fyd.gfx = new Phaser.Game(800, 600, Phaser.CANVAS, element, {
            preload: preload,
            create: create,
            update: update,
            render: render }, true, true);
    },

    inputDown : function() {

    },

    inputUp : function(event) {

    },

    launch : function() {


    },

    loadLevel : function(){
        fyd.rope= new Circle({
            radius : r_tmp,
            fixed : true,
            x : fyd.cfg.world.width/2,
            y : fyd.cfg.world.height/2
        });

        fyd.dude= new Circle({
            radius : r_tmp,
            mass : 7
        });
        fyd.dude.follow();
        fyd.dude.onSleep(function(){
            console.log("The Dude is dead !");
        });

        fyd.dude.setDistanceTo(fyd.rope, fyd.cfg.ropeLength);

        fyd.gfx.input.keyboard.onDownCallback = function(event){

            // enter
            if( event.keyCode == 13  ){
                fyd.dude.handsToRopeConstraint = fyd.physics.rcm.distanceConstraint(
                    fyd.dude.hands.getShape(),
                    fyd.rope.edge.getShape(),
                    0.5,
                    2*r_tmp
                );
                fyd.launched = false;
            }
        }

        fyd.ticker.subscribe(function(time, delta){

            // spacebar
            if( fyd.gfx.input.keyboard.isDown(32) ){
                var x = 1;
                var coef = 200;
                if( fyd.dude.getBody().velocity[0] < 0 )
                    x = -1;
                fyd.dude.getBody().applyForce( [coef*x*0.5, 2*coef], fyd.dude.getBody().position);
            }
        });


    },

    setBounds : function(width, height){

        fyd.gfx.world.setBounds(0, 0, fyd.cfg.world.width, fyd.cfg.world.height);

        fyd.cfg.world.width = width;
        fyd.cfg.world.height = height;

        if( fyd.bounds === undefined){
            fyd.bounds = {};

            var planeShape = new p2.Plane();

            fyd.bounds.bot = new p2.Body({position :[0,0]});
            fyd.bounds.bot.addShape(planeShape);

            fyd.bounds.left = new p2.Body({
                angle: -Math.PI/2,
                position: [0, 0]
            });
            fyd.bounds.left.addShape(planeShape);

            fyd.bounds.right = new p2.Body({
                angle: Math.PI/2,
                position: [fyd.cfg.world.width/fyd.phxToGfxScaleFactor, 0]
            });
            fyd.bounds.right.addShape(planeShape);

            fyd.bounds.top = new p2.Body({
                angle: Math.PI,
                position: [0, fyd.cfg.world.height/fyd.phxToGfxScaleFactor]
            });
            fyd.bounds.top.addShape(planeShape);

            fyd.phx.addBody(fyd.bounds.bot);
            fyd.phx.addBody(fyd.bounds.left);
            fyd.phx.addBody(fyd.bounds.right);
            fyd.phx.addBody(fyd.bounds.top);
        }else{
            fyd.bounds.top.position = [0, fyd.cfg.world.height/fyd.phxToGfxScaleFactor];
            fyd.bounds.right.position = [fyd.cfg.world.width/fyd.phxToGfxScaleFactor, 0];
            fyd.bounds.tileMap.width = fyd.cfg.world.width;
            fyd.bounds.tileMap.height = fyd.cfg.world.height;
        }
    }

};

