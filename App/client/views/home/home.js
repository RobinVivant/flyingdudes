
$.extend(Template.home, { 
    coverHeading : "The Flying Dudes !",
    bodyText : "Projet SI4 2014 pour le cours de Commande par Ordinateur encadré par <a href='mailto:strombon@polytech.unice.fr'>Jean-Paul Stromboni</a>.",
    learnMore : "Viens jouer dude !"
});

Template.home.created = function(){
    Session.set('activePage', 'home');
};