
Template.play.helpers({
    scriptsLoaded: function() { return Session.get('scriptsLoaded'); }
});

Template.play.created = function(){
    // permet de yield et laisser le template s'afficher complètement sinon le canvas ne s'affiche pas la première fois
    Meteor.defer(function(){

        fyd.init('game-canvas');

        $("#theDudeImg").hide(500);
    });
};

Template.play.destroyed = function(){
    fyd.delete();
    $("#theDudeImg").show(500);
};








