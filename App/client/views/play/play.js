
Template.play.helpers({
    scriptsLoaded: function() { return Session.get('scriptsLoaded'); }
});

Template.play.rendered = function(){
    fyd = new Fyd('game-canvas', config);
    $("#theDudeImg").hide(500);
};

Template.play.destroyed = function(){
    fyd.destroy();
    fyd = null;
    $("#theDudeImg").show(500);
};








