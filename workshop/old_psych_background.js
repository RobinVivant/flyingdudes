
Session.set('phaserLoaded', false);

phaserGame = {
    pgame : {},
    background : {}
};

phaserGame.getRandom = function(min, max) {
    return Math.random() * (max - min) + min;
}

phaserGame.preload = function() {

}

phaserGame.update = function() {


}

phaserGame.create = function() {

    phaserGame.background = phaserGame.pgame.add.sprite(0, 0);
    phaserGame.background.width = 800;
    phaserGame.background.height = 600;

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










