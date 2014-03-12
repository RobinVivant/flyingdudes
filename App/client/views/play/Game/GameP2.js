
Session.set('phaserLoaded', false);

var r_tmp = 10;

function preload() {
    fyd.gfx.load.image('background','assets/sprites/starfield.jpg');
    fyd.gfx.load.image('player','assets/sprites/the_dude.png');
    fyd.gfx.load.image('analog', 'assets/sprites/fusia.png');
    fyd.gfx.load.image('circle', 'assets/sprites/circle.png');
}

function create() {

    fyd.phx = new p2.World({
        gravity:[0,-1],
        broadphase : new p2.SAPBroadphase()
    });

    fyd.phx.solver.stiffness = 1e10;
    fyd.phx.solver.relaxation = 1;
    fyd.phx.solver.iterations = 20;

    fyd.phx.enableBodySleeping = true;
    fyd.phx.sleepSpeedLimit = 0.0001; // Body will feel sleepy if speed<1 (speed is the norm of velocity)
    fyd.phx.sleepTimeLimit = 1;

    fyd.ticker.subscribe(function(time, delta){
        fyd.phx.step(1/fyd.fps, delta);
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
    launched : false,
    launching : false,
    fps : 60.0,
    gfxScaleFactor : 10.0,
    onMouseDownDate : -1,
    mouseDownDurationLimit : 100,
    ticker : {},
    cfg : {},
    gfx : {},
    phx : {},
    CATEGORY_BOUNDS : Math.pow(2,0),
    CATEGORY_PLAYER : Math.pow(2,1),
    CATEGORY_ROPE : Math.pow(2,2),

    init : function(element){
        fyd.gfx = new Phaser.Game(800, 600, Phaser.CANVAS, element, {
            preload: preload,
            create: create,
            update: update,
            render: render }, true, true);
    },

    whenMouseDown : function(time, delta) {

        if( fyd.onMouseDownDate == -1 )
            return;

        if( !fyd.launched ){
            var x = 1;
            var coef = 30;
            if( fyd.dude.getBody().velocity[0] < 0 )
                x = -1;

            fyd.dude.getBody().applyForce( [coef*x*0.5, -2*coef], fyd.dude.getBody().position);
        }else {
            var duration = new Date().getTime() - fyd.onMouseDownDate;

            if(duration > fyd.mouseDownDurationLimit){
                fyd.launched = false;
                fyd.dude.ropeConstraint = fyd.dude.setDistanceTo(fyd.bar, 0);

                fyd.onMouseDownDate = -1;
                //fyd.ticker.unsubscribe(fyd.whenMouseDown);
            }
        }

    },

    onMouseUp : function(event) {

        if( fyd.onMouseDownDate == -1 )
            return;

        //fyd.ticker.unsubscribe(fyd.whenMouseDown);
        var duration = new Date().getTime() - fyd.onMouseDownDate;

        if(duration < fyd.mouseDownDurationLimit){
            // TODO : pb de concurence ici avec WhenMouseDown,
            // ligne : fyd.launched = false;
                console.log("");
                fyd.launching = true;
                fyd.launched = true;

                fyd.phx.removeConstraint(fyd.dude.ropeConstraint);

                setTimeout(function(){
                    fyd.launching = false;
                },fyd.mouseDownDurationLimit-1);
            }else
                fyd.jump();

        fyd.onMouseDownDate = -1;
    },

    onMouseDown : function(event){
        fyd.onMouseDownDate = new Date().getTime();

    },

    delete : function(){
        fyd.ticker.stop();
        fyd.gfx.destroy();
        fyd.gfx = null;
        fyd.phx = null;
    },

    loadLevel : function(){
        fyd.rope= new Circle({
            radius : r_tmp,
            fixed : true,
            x : fyd.cfg.world.width/2,
            y : fyd.cfg.world.height/2
        });

        fyd.rope.getShape().collisionGroup = 0;
        fyd.rope.getShape().collisionMask = 0;

        fyd.bar= new Circle({
            radius : r_tmp,
            mass : 1
        });
        fyd.bar.getShape().collisionGroup = 0;
        fyd.bar.getShape().collisionMask = 0;

        fyd.dude= new Circle({
            radius : r_tmp*2,
            mass : 0.2
        });
        fyd.dude.getShape().collisionGroup = fyd.CATEGORY_PLAYER;
        fyd.dude.getShape().collisionMask = fyd.CATEGORY_BOUNDS ;
        fyd.dude.getShape().material = new p2.Material();

        var cm = new p2.ContactMaterial(fyd.dude.getShape().material, fyd.planeShape.material, {
            friction : 0.3,
            restitution : 0.4
        });
        fyd.phx.addContactMaterial(cm);

        fyd.dude.follow();
        fyd.dude.onSleep(function(){
            console.log("The Dude is dead !");
        });

        fyd.bar.setDistanceTo(fyd.rope, fyd.cfg.ropeLength);
        fyd.dude.ropeConstraint = fyd.dude.setDistanceTo(fyd.bar, 0);

        fyd.gfx.input.mouse.mouseUpCallback = fyd.onMouseUp;
        fyd.gfx.input.mouse.mouseDownCallback = fyd.onMouseDown;

        fyd.ticker.subscribe(fyd.whenMouseDown);

    },

    jump : function(){
        var x = 1;
        var force = 50;
        if( fyd.dude.getBody().velocity[0] < 0 )
            x = -1;
        fyd.dude.getBody().applyForce( [x*force, force], fyd.dude.getBody().position);
        fyd.bar.getBody().applyForce( [-x*force, -force], fyd.bar.getBody().position);
    },

    setBounds : function(width, height){

        fyd.gfx.world.setBounds(0, 0, fyd.cfg.world.width, fyd.cfg.world.height);

        fyd.cfg.world.width = width;
        fyd.cfg.world.height = height;

        if( fyd.bounds === undefined){
            fyd.bounds = {};

            fyd.planeShape = new p2.Plane();

            fyd.planeShape.material = new p2.Material();

            fyd.planeShape.collisionMask = fyd.CATEGORY_PLAYER;
            fyd.planeShape.collisionGroup = fyd.CATEGORY_BOUNDS;

            fyd.bounds.bot = new p2.Body({position :[0,0]});
            fyd.bounds.bot.addShape(fyd.planeShape);

            fyd.bounds.left = new p2.Body({
                angle: -Math.PI/2,
                position: [0, 0]
            });
            fyd.bounds.left.addShape(fyd.planeShape);

            fyd.bounds.right = new p2.Body({
                angle: Math.PI/2,
                position: [fyd.cfg.world.width/fyd.gfxScaleFactor, 0]
            });
            fyd.bounds.right.addShape(fyd.planeShape);

            fyd.bounds.top = new p2.Body({
                angle: Math.PI,
                position: [0, fyd.cfg.world.height/fyd.gfxScaleFactor]
            });
            fyd.bounds.top.addShape(fyd.planeShape);



            fyd.phx.addBody(fyd.bounds.bot);
            fyd.phx.addBody(fyd.bounds.left);
            fyd.phx.addBody(fyd.bounds.right);
            fyd.phx.addBody(fyd.bounds.top);

        }else{
            fyd.bounds.top.position = [0, fyd.cfg.world.height/fyd.gfxScaleFactor];
            fyd.bounds.right.position = [fyd.cfg.world.width/fyd.gfxScaleFactor, 0];
            fyd.bounds.tileMap.width = fyd.cfg.world.width;
            fyd.bounds.tileMap.height = fyd.cfg.world.height;
        }
    }

};

