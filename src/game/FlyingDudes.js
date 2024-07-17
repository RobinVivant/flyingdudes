import Phaser from 'phaser';
import p2 from 'p2';
import { matrix, multiply, add, subtract, pow, transpose, inv, concat } from 'mathjs';

class FlyingDudes extends Phaser.Scene {
  constructor() {
    super('FlyingDudes');
    this.player = null;
    this.cursors = null;
    this.score = 0;
    this.fuel = 1000;
    this.maxThrust = 10;
    this.gravity = 9.8;
    this.Te = 0.04;
    this.erg = 45;
    this.dudeState = null;
    this.autoMode = { isLaunched: false, counter: 0, nbTargets: 6 };
    this.dataBoucleOuverte = { counter: 0, uCom: null, isRunning: false, isLaunched: false };
    this.TargetsCoordinates = [500, 250, 800, 200, 1300, 500, 1800, 300, 2400, 350, 2900, 400];
    this.TargetsReached = 0;
    this.cConso = 0;
    this.mfuel = 1000;
    this.mvide = 50;
    this.m = this.mvide + this.mfuel / 1000;
    this.h = 50;
    this.world = new p2.World({
      gravity: [0, 9.82]
    });
  }

  // Helper functions for vector and matrix operations are now handled by mathjs

  preload() {
    this.load.image('background', '/assets/sprites/background.png');
    this.load.image('player', '/assets/sprites/the_dude.png');
    this.load.image('target', '/assets/sprites/quille.png');
    this.load.image('analog', '/assets/sprites/fusia.png');
    this.load.image('circle', '/assets/sprites/circle.png');
    this.load.spritesheet('btn_reset', '/assets/reset-button.png', { frameWidth: 125, frameHeight: 52 });
  }

  create() {
    this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background').setOrigin(0);
    
    this.player = this.matter.add.sprite(100, this.game.config.height / 2, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.5);

    // Create a p2 body for the player
    const playerShape = new p2.Circle({ radius: this.player.width / 4 });
    this.playerBody = new p2.Body({
      mass: this.m,
      position: [this.player.x, this.player.y],
      velocity: [0, 0]
    });
    this.playerBody.addShape(playerShape);
    this.world.addBody(this.playerBody);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.targets = this.matter.add.group();
    this.createTargets();

    this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
      if (bodyA.gameObject === this.player || bodyB.gameObject === this.player) {
        const target = bodyA.gameObject === this.player ? bodyB.gameObject : bodyA.gameObject;
        if (this.targets.contains(target)) {
          this.collectTarget(this.player, target);
        }
      }
    });

    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    this.fuelText = this.add.text(16, 50, 'Fuel: 1000', { fontSize: '32px', fill: '#000' });

    this.dudeState = matrix([this.player.x, 0, -this.player.y, 0]);

    this.Ad = matrix([
      [1, this.Te, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, this.Te],
      [0, 0, 0, 1]
    ]);

    this.Bd = matrix([
      [0.5 * this.Te * this.Te, 0],
      [this.Te, 0],
      [0, 0.5 * this.Te * this.Te],
      [0, this.Te]
    ]);

    this.time.addEvent({ delay: this.Te * 1000, callback: this.updateState, callbackScope: this, loop: true });

    this.input.keyboard.on('keydown-R', this.actionOnReset, this);
    this.input.keyboard.on('keydown-A', this.actionOnAutoMode, this);

    this.cameras.main.startFollow(this.player);
  }

  update() {
    this.world.step(this.Te);
    this.handleInput();
    this.updateFuelDisplay();
    this.updateAutoMode();
    this.observState();
    this.player.setPosition(this.playerBody.position[0], this.playerBody.position[1]);
    this.player.setRotation(this.playerBody.angle);
  }

  handleInput() {
    if (!this.dataBoucleOuverte.isRunning) {
      let thrust = { x: 0, y: 0 };

      if (this.cursors.left.isDown) {
        thrust.x = -this.maxThrust;
      } else if (this.cursors.right.isDown) {
        thrust.x = this.maxThrust;
      }

      if (this.cursors.up.isDown) {
        thrust.y = -this.maxThrust;
      } else if (this.cursors.down.isDown) {
        thrust.y = this.maxThrust;
      }

      this.applyThrust(thrust);
    } else {
      this.applyBoucleOuverteThrust();
    }
  }

  applyThrust(thrust) {
    if (this.mfuel > 0) {
      const fuelConsumption = Math.sqrt(thrust.x * thrust.x + thrust.y * thrust.y) * this.Te;
      this.mfuel = Math.max(0, this.mfuel - fuelConsumption);
      this.cConso += fuelConsumption;

      const Un = matrix([thrust.x, thrust.y + this.gravity]);
      const adMultiplyDudeState = multiply(this.Ad, this.dudeState);
      const bdMultiplyUn = multiply(this.Bd, Un);
      const scaledBdMultiplyUn = multiply(bdMultiplyUn, this.erg / this.m);
      this.dudeState = add(adMultiplyDudeState, scaledBdMultiplyUn);

      // Apply force to the p2 body
      this.playerBody.applyForce([thrust.x, thrust.y]);
    }
  }

  applyBoucleOuverteThrust() {
    if (this.dataBoucleOuverte.counter < this.h) {
      const thrust = {
        x: this.dataBoucleOuverte.uCom.e(this.dataBoucleOuverte.counter * 2 + 1, 1),
        y: this.dataBoucleOuverte.uCom.e(this.dataBoucleOuverte.counter * 2 + 2, 1) + this.gravity / this.erg
      };
      this.applyThrust(thrust);
      this.dataBoucleOuverte.counter += 1;
    } else {
      this.dataBoucleOuverte.isRunning = false;
      this.dataBoucleOuverte.isLaunched = false;
      this.autoMode.counter += 2;
    }
  }

  updateState() {
    this.player.setPosition(this.dudeState.e(1), -this.dudeState.e(3));
    this.player.setVelocity(this.dudeState.e(2), -this.dudeState.e(4));
  }

  createTargets() {
    this.TargetsCoordinates.forEach((coord, index) => {
      if (index % 2 === 0) {
        const target = this.targets.create(coord, this.TargetsCoordinates[index + 1], 'target');
        target.setScale(0.13);
      }
    });
  }

  collectTarget(player, target) {
    target.disableBody(true, true);
    this.score += 10;
    this.TargetsReached += 1;
    this.scoreText.setText('Score: ' + this.score);

    if (this.targets.countActive(true) === 0) {
      this.createTargets();
    }
  }

  updateFuelDisplay() {
    this.fuelText.setText('Fuel: ' + Math.round(this.mfuel));
  }

  updateAutoMode() {
    if (this.autoMode.isLaunched) {
      if (this.autoMode.counter < this.autoMode.nbTargets * 2) {
        if (!this.dataBoucleOuverte.isLaunched) {
          this.dataBoucleOuverte.isLaunched = true;
          this.BoucleOuverte(
            this.dudeState,
            [this.TargetsCoordinates[this.autoMode.counter], -this.TargetsCoordinates[this.autoMode.counter + 1]]
          );
        }
      } else {
        this.autoMode.isLaunched = false;
        this.autoMode.counter = 0;
      }
    }
  }

  observState() {
    if (this.mfuel > 0) {
      this.m = this.mvide + this.mfuel / 1000;
    } else {
      this.m = this.mvide;
    }

    this.erg = this.erg / this.m;
    this.Bd = Matrix.create([
      [(this.erg * Math.pow(this.Te, 2)) / 2, 0],
      [this.erg * this.Te, 0],
      [0, (this.erg * Math.pow(this.Te, 2)) / 2],
      [0, this.erg * this.Te]
    ]);
  }

  actionOnReset() {
    this.cConso = 0;
    this.mfuel = 1000;
    this.dudeState = Vector.create([100, 50, -300, 0]);
    this.TargetsReached = 0;
    this.score = 0;
    this.scoreText.setText('Score: ' + this.score);
    this.targets.clear(true, true);
    this.createTargets();
  }

  actionOnAutoMode() {
    if (!this.autoMode.isLaunched) {
      this.cConso = 0;
      this.mfuel = 1000;
      this.dudeState = Vector.create([100, 50, -300, 0]);
      this.autoMode.isLaunched = true;
    }
  }

  BoucleOuverte(posDude, goalPos) {
    this.dataBoucleOuverte.counter = 0;

    const Xh = matrix([goalPos[0], 0, goalPos[1], 0]);

    // Calcul de la matrice de gouvernabilité G
    let G = this.Bd;
    for (let n = 1; n < this.h; n++) {
      const tmpAd = pow(this.Ad, n);
      G = concat(multiply(tmpAd, this.Bd), G);
    }

    if (G.size()[0] < this.Ad.size()[0]) {
      console.log("Erreur : Pas de solutions");
    } else {
      const y = subtract(Xh, multiply(pow(this.Ad, this.h), posDude));
      const Gt = transpose(G);
      const GGtInverse = inv(multiply(G, Gt));
      this.dataBoucleOuverte.uCom = multiply(multiply(Gt, GGtInverse), y);
      this.dataBoucleOuverte.isRunning = true;
    }
  }
}

export default FlyingDudes;
