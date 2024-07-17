import Phaser from 'phaser';
import * as math from 'mathjs';

class FlyingDudes extends Phaser.Scene {
  constructor() {
    super('FlyingDudes');
    this.player = null;
    this.cursors = null;
    this.score = 0;
    this.fuel = 1000;
    this.maxThrust = 10;
    this.gravity = 200;
    this.Te = 0.016;
    this.erg = 200;
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
  }

  preload() {
    this.load.image('background', '/assets/sprites/background.png', { premultiplyAlpha: false });
    this.load.image('player', '/assets/sprites/the_dude.png', { premultiplyAlpha: false });
    this.load.image('target', '/assets/sprites/quille.png', { premultiplyAlpha: false });
  }

  create() {
    this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'background')
      .setScale(2)
      .setDepth(0);
    
    this.player = this.physics.add.sprite(100, this.game.config.height / 2, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.25);
    this.player.setDepth(1);
    this.player.setDrag(100);
    this.player.setMaxVelocity(300);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.targets = this.physics.add.staticGroup();
    this.createTargets();

    this.physics.add.overlap(this.player, this.targets, this.collectTarget, null, this);

    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    this.fuelText = this.add.text(16, 50, 'Fuel: 1000', { fontSize: '32px', fill: '#000' });

    this.dudeState = math.matrix([this.player.x, 0, -this.player.y, 0]);

    this.Ad = math.matrix([
      [1, this.Te, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, this.Te],
      [0, 0, 0, 1]
    ]);

    this.Bd = math.matrix([
      [0.5 * this.Te * this.Te, 0],
      [this.Te, 0],
      [0, 0.5 * this.Te * this.Te],
      [0, this.Te]
    ]);

    this.time.addEvent({ delay: this.Te * 1000, callback: this.updateState, callbackScope: this, loop: true });

    this.input.keyboard.on('keydown-R', this.actionOnReset, this);
    this.input.keyboard.on('keydown-A', this.actionOnAutoMode, this);

    this.cameras.main.startFollow(this.player);

    // Add instructions text
    this.add.text(16, this.game.config.height - 120, 'How to Play:', { fontSize: '24px', fill: '#000' });
    this.add.text(16, this.game.config.height - 90, '- Use arrow keys to guide The Dude', { fontSize: '16px', fill: '#000' });
    this.add.text(16, this.game.config.height - 70, '- Collect floating targets', { fontSize: '16px', fill: '#000' });
    this.add.text(16, this.game.config.height - 50, '- Press R to reset the game', { fontSize: '16px', fill: '#000' });
    this.add.text(16, this.game.config.height - 30, '- Press A for auto mode', { fontSize: '16px', fill: '#000' });
  }

  update() {
    this.handleInput();
    this.updateFuelDisplay();
    this.updateAutoMode();
    this.observState();
  }

  handleInput() {
    if (!this.dataBoucleOuverte.isRunning) {
      const acceleration = 300;
      
      // Reset acceleration
      this.player.setAcceleration(0);

      if (this.cursors.left.isDown) {
        this.player.setAccelerationX(-acceleration);
      } else if (this.cursors.right.isDown) {
        this.player.setAccelerationX(acceleration);
      }

      if (this.cursors.up.isDown) {
        this.player.setAccelerationY(-acceleration - this.gravity);
      } else if (this.cursors.down.isDown) {
        this.player.setAccelerationY(acceleration + this.gravity);
      } else {
        this.player.setAccelerationY(this.gravity);
      }

      this.applyThrust(this.player.body.acceleration);
    } else {
      this.applyBoucleOuverteThrust();
    }

    // Check if fuel has run out
    if (this.mfuel <= 0) {
      this.player.setAcceleration(0, this.gravity);
      this.fuelText.setText('Fuel: 0 - Out of fuel!');
    }
  }

  applyThrust(acceleration) {
    if (this.mfuel > 0) {
      const fuelConsumption = Math.sqrt(acceleration.x * acceleration.x + acceleration.y * acceleration.y) * this.Te / 100;
      this.mfuel = Math.max(0, this.mfuel - fuelConsumption);
      this.cConso += fuelConsumption;

      const Un = math.matrix([acceleration.x / 100, acceleration.y / 100]);
      const adMultiplyDudeState = math.multiply(this.Ad, this.dudeState);
      const bdMultiplyUn = math.multiply(this.Bd, Un);
      const scaledBdMultiplyUn = math.multiply(bdMultiplyUn, this.erg / this.m);
      this.dudeState = math.add(adMultiplyDudeState, scaledBdMultiplyUn);
    } else {
      this.player.setAcceleration(0, this.gravity);
    }
  }

  applyBoucleOuverteThrust() {
    if (this.dataBoucleOuverte.counter < this.h) {
      const thrust = {
        x: this.dataBoucleOuverte.uCom.get([this.dataBoucleOuverte.counter * 2, 0]),
        y: this.dataBoucleOuverte.uCom.get([this.dataBoucleOuverte.counter * 2 + 1, 0]) + this.gravity / this.erg
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
    const x = this.dudeState.get([0]);
    const y = -this.dudeState.get([2]);
    const vx = this.dudeState.get([1]);
    const vy = -this.dudeState.get([3]);
    
    this.player.setPosition(x, y);
    this.player.setVelocity(vx, vy);
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

    this.erg = 45 / this.m;
    this.Bd = math.matrix([
      [(this.erg * Math.pow(this.Te, 2)) / 2, 0],
      [this.erg * this.Te, 0],
      [0, (this.erg * Math.pow(this.Te, 2)) / 2],
      [0, this.erg * this.Te]
    ]);
  }

  actionOnReset() {
    this.cConso = 0;
    this.mfuel = 1000;
    this.dudeState = math.matrix([100, 50, -300, 0]);
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
      this.dudeState = math.matrix([100, 50, -300, 0]);
      this.autoMode.isLaunched = true;
    }
  }

  BoucleOuverte(posDude, goalPos) {
    this.dataBoucleOuverte.counter = 0;

    const Xh = math.matrix([[goalPos[0]], [0], [goalPos[1]], [0]]);

    // Calcul de la matrice de gouvernabilité G
    let G = this.Bd;
    for (let n = 1; n < this.h; n++) {
      const tmpAd = math.pow(this.Ad, n);
      G = math.concat(G, math.multiply(tmpAd, this.Bd), 1);
    }

    if (math.size(G)[0] < math.size(this.Ad)[0]) {
      console.log("Erreur : Pas de solutions");
    } else {
      const y = math.subtract(Xh, math.multiply(math.pow(this.Ad, this.h), math.matrix([[posDude.get([0])], [posDude.get([1])], [posDude.get([2])], [posDude.get([3])]])));
      const Gt = math.transpose(G);
      const GGtInverse = math.inv(math.multiply(G, Gt));
      this.dataBoucleOuverte.uCom = math.multiply(math.multiply(Gt, GGtInverse), y);
      this.dataBoucleOuverte.isRunning = true;
    }
  }
}

export default FlyingDudes;
