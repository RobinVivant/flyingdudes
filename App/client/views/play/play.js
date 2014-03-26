
Template.play.helpers({
    scriptsLoaded: function() { return Session.get('scriptsLoaded'); }
});

Template.play.created = function(){
    // permet de yield et laisser le template s'afficher complètement sinon le canvas ne s'affiche pas la première fois
    Meteor.defer(function(){

        fyd = new Fyd('game-canvas', config);

        $("#theDudeImg").hide(500);
    });
};

Template.play.destroyed = function(){
    fyd.destroy();
    $("#theDudeImg").show(500);
};








