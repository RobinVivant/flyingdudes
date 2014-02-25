Session.set('phaserLoaded', false);
Template.play.helpers({
  scriptsLoaded: function() { return Session.get('scriptsLoaded'); }
});

function phaserPreload(){
    
};

function phaserCreate(){
    
};

function phaserUpdate(){
    
};

Template.play.rendered = function(){
    
    $.getScript("//cdnjs.cloudflare.com/ajax/libs/phaser/1.1.4/phaser.min.js", function(data, textStatus, jqxhr) {
        var phaser = new Phaser.Game(800, 600, Phaser.AUTO, 'game-canvas');
        Session.set('phaser', phaser);
        
        Session.set('scriptsLoaded', true);
        console.log("Scripts loaded!");
    });
    
};

