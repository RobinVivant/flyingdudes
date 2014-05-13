const aps =0.5; //acceleration par frame

function Player(state) {
    this.state=state;

    this.sprite = null;
    this.cursors = null;

    this.infoText=null;
    
    this.physics=null;

    this.mvide= 100;          // masse à vide (kg)
    this.mfuel=10;           // masse de carburant (kg)
    this.m = this.mvide + (this.mfuel/100);  // masse totale
    this.ve=45; // vitesse d'éjection des gaz (en m/s), ou specific impulse
    this.maxThrust = 5; // amax du jetpack

    this.onFloor = false;
};
 
Player.prototype = {
 
    preload: function () {
        this.physics = new MyPhysics();

    },
 
    create: function () {
        this.xInit = this.state.world.width/2;
        this.yInit = this.state.world.height/2;
        this.sprite = this.state.add.sprite(this.xInit-50, this.yInit+60, 'jetman');
        this.sprite.animations.add('walk',[0,1,2,3],15,true);
        this.sprite.animations.add('jump',[4]);
        this.sprite.animations.add('fly',[5,6],15,true);
        this.sprite.frame=4;
        this.state.physics.enable(this.sprite,Phaser.Physics.ARCADE);
        //this.sprite.body.moves=false;
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.setSize(99,120,-20,0);

        this.cursors = this.state.input.keyboard.createCursorKeys();

        this.infoText = this.state.add.text(16, 16, 'frame 1', { fontSize: '32px', fill: '#FFF' });
        
        this.physics.create(this.sprite,this);
        time=0;
    },
 
    update: function() {
        time+=this.state.time.elapsed;
/*
        this.infoText.text = 'fps: '+ this.state.time.fps + 'dt: '+ this.state.time.elapsed + ' myTime: '+ this.physics.time+
            '\n time: '+time/1000 + ' physicsElapsed: '+ this.state.time.physicsElapsed+
            '\n info : \n x: ' + this.physics.X.e(1,1) + ', y: '+ this.physics.X.e(3,1) +
            '\n consomation: '+this.physics.cConso+', fuel: '+this.mfuel+
            '\n ax: '+this.physics.aCom.x+', ay: '+this.physics.aCom.y+
            '\n aangle: '+ this.sprite.body.angle;
*/
        this.infoText.text ='Time = '+time/1000+
            '\nPosition x: ' + this.physics.X.e(1,1).toPrecision(4) + ', y: '+ this.physics.X.e(3,1).toPrecision(4) +
            '\nConsomation: '+this.physics.cConso.toPrecision(4)+', fuel restant: '+this.mfuel.toPrecision(4);


        if(this.state.input.activePointer.isDown){
            this.physics.boucleOuverteHFin(this.physics.X,$M([[this.state.input.x-50],[0],[-this.state.input.y+60],[0]]),50);
        }
        //si il n'y a pas de commande en cours --> commande manuelle
        if(!this.physics.dataBoucleOuverteHFin.running){

            if(this.sprite.body.onFloor()){
                if(this.cursors.left.isDown)
                {
                    this.physics.aCom.y=0;
                    this.physics.aCom.x = Math.abs(this.physics.maxThrust)> Math.abs(this.physics.aCom.x)? this.physics.aCom.x-aps : -this.physics.maxThrust;
                    this.sprite.animations.play('walk');
                }
            else if(this.cursors.right.isDown)
                {
                    this.physics.aCom.y=0;
                    this.physics.aCom.x = Math.abs(this.physics.maxThrust)> Math.abs(this.physics.aCom.x)? this.physics.aCom.x+aps : this.physics.maxThrust;
                    this.sprite.animations.play('fly');
                }
                else if(this.cursors.up.isDown)
                {
                    //this.body.velocity.y=400;
                    this.sprite.animations.play('jump');
                }
            }

            if(this.cursors.left.isDown)
            {
                this.sprite.body.angle += 10;
                this.physics.aCom.y=0;
                this.physics.aCom.x = Math.abs(this.physics.maxThrust)> Math.abs(this.physics.aCom.x)? this.physics.aCom.x-aps : -this.physics.maxThrust;
                this.sprite.animations.play('fly');
            }
            else if(this.cursors.right.isDown)
            {
                this.physics.aCom.y=0;
                this.physics.aCom.x = Math.abs(this.physics.maxThrust)> Math.abs(this.physics.aCom.x)? this.physics.aCom.x+aps : this.physics.maxThrust;
                this.sprite.animations.play('fly');
            }
            else if(this.cursors.up.isDown)
            {
                this.physics.aCom.x=0;
                this.physics.aCom.y = Math.abs(this.physics.maxThrust)> Math.abs(this.physics.aCom.y)? this.physics.aCom.y+aps : this.physics.maxThrust;
                this.sprite.animations.play('fly');
            }
            else if(this.cursors.down.isDown)
            {
                //   this.physics.aCom.y = Math.abs(this.physics.maxThrust)> Math.abs(this.physics.aCom.y)? this.physics.aCom.y+1 : this.physics.maxThrust;
            }

            else
            {
                this.physics.aCom.x=0;
                this.physics.aCom.y=0;
                this.sprite.animations.stop();

                this.sprite.frame = 4;
            }

        }
    }

};