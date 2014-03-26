
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

    fyd.phaser.physics.startSystem(Phaser.Physics.ARCADE);
    fyd.phaser.input.mouse.mouseDownCallback = fyd.onMouseDown;

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

    init : function(element){
        fyd.phaser = new Phaser.Game(800, 600, Phaser.CANVAS, element, {
            preload: preload,
            create: create,
            update: update,
            render: render },
            true,
            true
        );
    },

    whenMouseDown : function(time, delta) {


    },

    onMouseUp : function(event) {


    },

    onMouseDown : function(event){
        fyd.dude.body.velocity.x = 10;
    },

    destroy : function(){
        fyd.ticker.stop();
        fyd.phaser.destroy();
        fyd.phaser = null;
    },

    loadLevel : function(){

        fyd.ticker.subscribe(fyd.whenMouseDown);

        fyd.dude = fyd.phaser.add.sprite(fyd.cfg.world.width/2, fyd.cfg.world.height/2, 'player');
        fyd.dude.scale.set(0.5);
        fyd.phaser.physics.arcade.enable(fyd.dude);

        fyd.phaser.camera.follow(fyd.dude);

    },

    jump : function(){

    },

    setBounds : function(width, height){
        fyd.bounds.tileMap = fyd.phaser.add.tileSprite(0, 0, width, height, 'background');
        fyd.phaser.world.setBounds(0, 0, width, height);
    }

};

