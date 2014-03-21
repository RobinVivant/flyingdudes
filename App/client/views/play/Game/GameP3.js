
Session.set('phaserLoaded', false);


function preload() {
    fyd.phaser.load.image('background','assets/sprites/starfield.jpg');
    fyd.phaser.load.image('player','assets/sprites/the_dude.png');
    fyd.phaser.load.image('analog', 'assets/sprites/fusia.png');
    fyd.phaser.load.image('circle', 'assets/sprites/circle.png');
}

function create() {
    // NE PAS METTRE CES DEUX LIGNES PLUS LOIN
    fyd.setBounds(fyd.cfg.world.width, fyd.cfg.world.height);

    fyd.phaser.physics.startSystem(Phaser.Physics.P2JS);
    fyd.phaser.physics.p2.gravity.y = 100;

    fyd.phaser.physics.p2.defaultRestitution = 0.9;


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
    phaser : {},
    bounds : {},
    CATEGORY_BOUNDS : Math.pow(2,0),
    CATEGORY_PLAYER : Math.pow(2,1),
    CATEGORY_ROPE : Math.pow(2,2),

    init : function(element){
        fyd.phaser = new Phaser.Game(800, 600, Phaser.CANVAS, element, {
            preload: preload,
            create: create,
            update: update,
            render: render },
            true,
            true/*,
            { p2 : true,
              gravity: [0, -9.82],
              broadphase: new p2.SAPBroadphase()
            }*/
        );
    },

    whenMouseDown : function(time, delta) {


    },

    onMouseUp : function(event) {


    },

    onMouseDown : function(event){

    },

    destroy : function(){
        fyd.ticker.stop();
        fyd.phaser.destroy();
        fyd.phaser = null;
    },

    loadLevel : function(){

        fyd.ticker.subscribe(fyd.whenMouseDown);

        fyd.rope = {};
        fyd.rope.center = fyd.phaser.add.sprite(fyd.cfg.world.width/2, fyd.cfg.world.height/2, 'circle');
        fyd.phaser.physics.p2.enable(fyd.rope.center, true);
        fyd.rope.center.width = 30;
        fyd.rope.center.height = 30;
        fyd.rope.center.body.setCircle(15);

        fyd.rope.center.body.data.mass = 0;
        //fyd.rope.center.body.static = true;
        fyd.rope.center.body.data.motionState = 2; //p2.Body.STATIC;

        fyd.dude = fyd.phaser.add.sprite(fyd.cfg.world.width/2, fyd.cfg.world.height/2, 'player');
        fyd.phaser.physics.p2.enable(fyd.dude, true);
        fyd.dude.scale.set(0.5);
        fyd.dude.body.setCircle(fyd.dude.height/2);

        var constraint = fyd.phaser.physics.p2.createDistanceConstraint(fyd.dude, fyd.rope.center, fyd.cfg.ropeLength);

        fyd.dude.body.velocity.x = 100;
        fyd.dude.body.velocity.y = 1000;



        fyd.phaser.camera.follow(fyd.dude);


    },

    jump : function(){

    },

    setBounds : function(width, height){
        fyd.bounds.tileMap = fyd.phaser.add.tileSprite(0, 0, width, height, 'background');
        fyd.phaser.world.setBounds(0, 0, width, height);
    }

};

