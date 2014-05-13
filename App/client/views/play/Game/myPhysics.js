var m2p = 7;
MyPhysics = function(){
    this.sprite;
    this.player;

    // X : ([X],
    //       [dX],
    //       [Y],
    //       [dY])
    this.X=null;


    this.Te = 0.04;
    this.time=0;

    this.mvide;          // masse à vide (kg)
    this.mfuel;           // masse de carburant (kg)
    this.m ;  // masse totale
    this.ve;              // vitesse d'éjection des gaz (en m/s), ou specific impulse
    this.erg ;          // noté epsilon dans le cours,
    //accélération horizontale = erg*ax, verticale erg*ay, erg ~= 0.5878
    this.maxThrust;
    this.g_Terre = 9.8*m2p;      // pseanteur terrestre en m/s²

//Representation d'état discretisé de notre probleme :
// Xn+1 = A *Xn + B *Un
// sn = C * Xn

    this.A = $M([ [1,0.0396027,0,0],
        [0,0.9801987,0,0],
        [0,0,1,0.0396027],
        [0,0,0,0.9801987] ]); //frottement : 0.5

//    this.A = $M([ [1,0.0397610,0,0],
//        [0,0.9880717,0,0],
//        [0,0,1,0.0397610],
//        [0,0,0,0.9880717] ]);
    this.B = $M([ [(this.erg*Math.pow(this.Te,2))/2,0],
        [this.erg*this.Te                ,0],
        [0                     ,(this.erg*Math.pow(this.Te,2))/2],
        [0                     ,this.erg*this.Te] ]);
// Un = [ [axn],
//        [ayn-g_Terre/erg] ]
    this.Un;

    this.C = $M([ [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,0,1] ]);

    //commande des reacteurs
    this.aCom = {x:0,y:0};

    this.cConso=0;

    this.dataBoucleOuverteHFin = {nb_iterate:0,h:0,uCom:null, running:false};


    this.processConsommation= function(){
        var gr = this.aCom.x+this.aCom.y!=0 ?Math.sqrt(this.aCom.x*this.aCom.x + Math.pow(this.aCom.y+this.g_Terre,2)) : 0;
        this.cConso+= (gr/this.erg)*this.Te;
        this.player.mfuel-=(gr/this.erg)*this.Te;
    }

   this.observState= function(){

        this.mfuel=this.player.mfuel;           // masse de carburant (kg)
        this.m = this.mvide + this.mfuel;  // masse totale
        this.ve=this.player.ve*m2p;              // vitesse d'éjection des gaz (en m/s), ou specific impulse
        this.erg = this.ve/this.m;          // noté epsilon dans le cours,
        //accélération horizontale = erg*ax, verticale erg*ay, erg ~= 0.5878
        this.maxThrust = this.player.maxThrust*m2p;
        this.B = $M([ [(this.erg*Math.pow(this.Te,2))/2,0],
           [this.erg*this.Te                ,0],
           [0                     ,(this.erg*Math.pow(this.Te,2))/2],
           [0                     ,this.erg*this.Te] ]);
       this.A = $M([ [1,0.0396027,0,0],
           [0,0.9801987,0,0],
           [0,0,1,0.0396027],
           [0,0,0,0.9801987] ]); //frottement : 0.5
    }
};
    
MyPhysics.prototype = {
    create: function(spr,player){
        this.sprite = spr;
        this.player = player;
        this.X=$M([[this.sprite.body.x],[0],[-this.sprite.body.y],[0]]);

        this.mvide= this.player.mvide;          // masse à vide (kg)

        this.observState();

        this.timer = player.state.time.events.loop(this.Te*1000,this.update,this);
        //this.boucleOuverteHFin(this.X,$M([[620],[0],[-100],[0]]),30);

    },

    restart: function(matX){
        this.X=matX;
        this.changePos();
        this.timer.timer.start();
    },

    update: function(){
      this.observState();
      this.time+=this.Te;
      if(this.dataBoucleOuverteHFin.running){
          this.applyCommande(this.dataBoucleOuverteHFin.uCom,this.dataBoucleOuverteHFin.h);
      }
      this.updatePosition();
      this.processConsommation();
    },


    updatePosition: function(){

        var Un = $M([[this.aCom.x],[this.aCom.y-this.g_Terre/this.erg]]);
        if(this.sprite.body.onFloor() || this.sprite.body.blocked.up){
            this.X=$M([[this.X.e(1,1)],
                [this.X.e(2,1)],
                [-this.sprite.y],
                [0]]);
            this.B = $M([ [(this.erg*Math.pow(this.Te,2))/2,0],
                [this.erg*this.Te                ,0],
                [0                     ,0],
                [0                     ,0] ]);
            this.A = $M([ [1,0.0396027,0,0],
                [0,0.9801987,0,0],
                [0,0,1,0],
                [0,0,0,0] ]); //frottement : 0.5
            }
        this.X= this.A.multiply(this.X).add(this.B.multiply(Un));
        this.changePos();
    },

    reset: function(){
        this.X=$M([[this.player.xInit],[0],
                    [-this.player.yInit],[0]]);
        this.changePos();
    },

    changePos: function(){
        this.sprite.body.x = this.X.e(1,1);
        this.sprite.body.y = -this.X.e(3,1);
    },

    boucleOuverteHFin: function(Xi,Xf,h){
        this.dataBoucleOuverteHFin.nb_iterate=0;
        this.dataBoucleOuverteHFin.h=h;

        //calcul de la gouvernabilité
        var G = this.B;
        for(var i = 1;i<h;i++)
        {
            var tmp=this.power(this.A,i);
            G=tmp.multiply(this.B).augment(G);
        }
        if(G.rank()<this.A.rows())
        {
            console.log("erreur, pas gouvernable")
        }
        else
        {
            var y = Xf.subtract(this.power(this.A,h).multiply(Xi));
            var Gt = G.transpose();
            var invGGt = G.multiply(Gt).inverse();
            this.dataBoucleOuverteHFin.uCom = (Gt.multiply(G.multiply(Gt).inverse()).multiply(y));
        }
        this.dataBoucleOuverteHFin.running = true;
    },

    //Une matrice a la puissance pow
    power: function(matrice,pow){
        var res=matrice;
        for(var i= 1;i<pow;i++){
            res=res.multiply(matrice);
        }
        return res;
    },

    applyCommande: function(u,h){
        if(this.dataBoucleOuverteHFin.nb_iterate<h){
            this.aCom.x = this.dataBoucleOuverteHFin.uCom.e(this.dataBoucleOuverteHFin.nb_iterate*2+1,1);
            this.aCom.y = this.dataBoucleOuverteHFin.uCom.e(this.dataBoucleOuverteHFin.nb_iterate*2+2,1) + this.g_Terre/this.erg;
            this.dataBoucleOuverteHFin.nb_iterate+=1;
            console.log(this.aCom.x+" "+this.aCom.y);
        }
        else{
            this.dataBoucleOuverteHFin.running=false;
         }
    }
};