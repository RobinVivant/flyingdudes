
Session.set('phaserLoaded', false);

phaserGame = {
    pgame : {},
    background : {},
    filterPlasma : {},
    flicker : 0.0001,
    level : 1.05,
    flagFS : false,
    counter : 0
};

phaserGame.getRandom = function(min, max) {
    return Math.random() * (max - min) + min;
}

phaserGame.preload = function() {
    phaserGame.pgame.load.script('filterPlasma', 'filters/Plasma.js');
}

phaserGame.update = function() {

    phaserGame.filterPlasma.update();

    if(phaserGame.flagFS == false){
        phaserGame.filterPlasma.blueShift = phaserGame.getRandom(phaserGame.level-phaserGame.flicker,phaserGame.level+phaserGame.flicker) * Math.abs(Math.tan(phaserGame.filterPlasma.blueShift));
        phaserGame.filterPlasma.redShift = phaserGame.getRandom(phaserGame.level-phaserGame.flicker,phaserGame.level+phaserGame.flicker) * Math.abs(Math.tan(phaserGame.filterPlasma.redShift));
        phaserGame.filterPlasma.greenShift = phaserGame.getRandom(phaserGame.level-phaserGame.flicker,phaserGame.level+phaserGame.flicker) * Math.abs(Math.tan(phaserGame.filterPlasma.greenShift));
    }else{

    }
    //filterPlasma.greenShift = Math.tan(filterPlasma.greenShift-getRandom(0.0,flicker));
    phaserGame.filterPlasma.size = Math.sin(phaserGame.counter+=0.005) * (0.03 - 0.02) + 0.02;
}

phaserGame.create = function() {

    phaserGame.background = phaserGame.pgame.add.sprite(0, 0);
    phaserGame.background.width = 800;
    phaserGame.background.height = 600;

    phaserGame.filterPlasma = phaserGame.pgame.add.filter('Plasma', 800, 600);
    phaserGame.filterPlasma.size = 0.03;

    phaserGame.background.filters = [phaserGame.filterPlasma];

    phaserGame.pgame.input.onDown.add(function(){
        phaserGame.flagFS = !phaserGame.flagFS;
    }, phaserGame);

    Session.set('scriptsLoaded', true);
}


Template.play.helpers({
    scriptsLoaded: function() { return Session.get('scriptsLoaded'); }
});

Template.play.created = function(){

    $("#theDudeImg").hide(500);

    phaserGame.pgame = new Phaser.Game(0, 0, Phaser.AUTO, 'game-canvas', {
            preload: phaserGame.preload,
            create: phaserGame.create,
            update: phaserGame.update
        },
        true, // background transparent
        true // antialias
    );
};

Template.play.destroyed = function(){
    $("#theDudeImg").show(500);
    phaserGame.pgame.destroy()
};










