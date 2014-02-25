
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

var background;
var filterPlasma;
var flicker = 0.0001;
var level = 1.05;

var viewport = { width : $(window).width(), height : $(window).height() };
var game = new Phaser.Game(viewport.width, viewport.height, Phaser.AUTO, 'game-canvas', { preload: preload, create: create, update: update });

function preload() {
    game.load.script('filterPlasma', 'js/filters/Plasma.js');
}

function create() {
    
	background = game.add.sprite(0, 0);
	background.width = viewport.width;
	background.height = viewport.height;

	filterPlasma = game.add.filter('Plasma', viewport.width, viewport.height);
    filterPlasma.size = 0.03;
        
	background.filters = [filterPlasma];
	
	game.input.onDown.add(toggleFullscreen, this);

    game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL; //resize your window to see the stage resize too
    game.stage.scale.setShowAll();
    game.stage.scale.refresh();
}

var counter = 0;
function update() {

	filterPlasma.update();

    if(flagFS == false){
    	filterPlasma.blueShift = getRandom(level-flicker,level+flicker) * Math.abs(Math.tan(filterPlasma.blueShift));
    	filterPlasma.redShift = getRandom(level-flicker,level+flicker) * Math.abs(Math.tan(filterPlasma.redShift));
        filterPlasma.greenShift = getRandom(level-flicker,level+flicker) * Math.abs(Math.tan(filterPlasma.greenShift));
	}else{
    
	}
	//filterPlasma.greenShift = Math.tan(filterPlasma.greenShift-getRandom(0.0,flicker));
	filterPlasma.size = Math.sin(counter+=0.005) * (0.03 - 0.02) + 0.02;
}

var flagFS = false;
function toggleFullscreen(pointer){
    /*
    if( flagFS == true ){
        game.stage.scale.stopFullScreen();
    }else{
        game.stage.scale.startFullScreen();
    }
*/
    flagFS = !flagFS;
}
