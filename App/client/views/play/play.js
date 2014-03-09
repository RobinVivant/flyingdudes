
Template.play.helpers({
    scriptsLoaded: function() { return Session.get('scriptsLoaded'); }
});

Template.play.created = function(){
    // permet de yield et laisser le template s'afficher complètement sinon le canvas ne s'affiche pas la première fois
    Meteor.defer(function(){

        fyd.phaser = new Phaser.Game(800, 600, Phaser.CANVAS, 'game-canvas', {
            preload: fyd.preload,
            create: fyd.create,
            update: fyd.update,
            render: fyd.render }, true, true);
        $("#theDudeImg").hide(500);
    });
};

Template.play.destroyed = function(){
    $("#theDudeImg").show(500);
};








