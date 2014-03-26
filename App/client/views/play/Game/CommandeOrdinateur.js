
CommandeOrdinateur = function () {
}

// Pre-conditions:
// -- Assuming the pos and goalPos parameters are constructed this way : [[Xpos, Xvitesse], [Ypos, Yvitesse]]
CommandeOrdinateur.BoucleOuverte = function(pos, goalPos, puissance) {
    var Te = 1/60;

    // Nombre de periodes d'echantillonnages
    var h = 100;
    var X0 = $M([pos[0], pos[1]]);
    var Xh = $M([goalPos[0], goalPos[1]]);
    // masse
    var m = 70;
    var ve = 10; // vitesse appliquee par le joueur - ve = puissance
    var erg = ve/m; // note epsilon en cours
    var gravity = 9.78;
    var A = $M([
        [0,1,0,0],
        [0,0,0,0],
        [0,0,0,1],
        [0,0,0,0]
    ]);
    var B = $M([
        [0,0],
        [erg,0],
        [0,0],
        [0,erg]
    ]);

    var Ad = $M([
        [1,Te,0,0],
        [0,1,0,0],
        [0,0,1,Te],
        [0,0,0,1]

    ]); //lld('a');
    var Bd = $M([
        [erg*(Te*Te)/2, 0],
        [erg*Te, 0],
        [0, erg*(Te*Te)/2],
        [0, erg*Te]
    ]); //lld('b');
    var Cd = $M([
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,0,1]
    ]); //lld('c');

    // Calcul de la matrice de gouvernabilité G
    var G = Bd;
    for (var n = 1; n <= h-1; n++ ) {
        for (var t = 1; t <= n; t++) {
            var tmpAd = Ad.multiply(Ad);
        }
        G = [tmpAd.multiply(Bd),G];
    }
    if (G.rank() < Ad.rows()) {
        Console.log("Pas de solutions");
    }
    else {
        Console.log("Calcul d'une solution");
        for (var t = 1; t <= h; t++) {
            var tmpAd = Ad.multiply(Ad);
        }
        var y = Xh.subtract(tmpAd.multiply(X0));
        var Gt = G.transpose();
        var u = (Gt.multiply(G.inv().multiply(Gt)).multiply(y));
        var dimensionsU = u.dimensions();
        // number of rows are the number of commands


        // vecteur des commandes ax et ay des reacteurs
        var a = u;
        for (var i = 1; i <= h; i++) {
            a[2*n] = a[2*n] + gravity/erg;
        }
        // pour avoir sous forme d'un tableau
        return a.transpose();
    }
};

CommandeOrdinateur.RetourDetat = function(elements) {

};