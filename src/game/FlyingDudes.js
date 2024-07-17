import Phaser from 'phaser';
import { Matrix, Vector } from 'sylvester';

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
  }

  preload() {
    this.load.image('background', 'assets/sprites/background.png');
    this.load.image('player', 'assets/sprites/the_dude.png');
    this.load.image('target', 'assets/sprites/quille.png');
  }

  create() {
    this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background').setOrigin(0);
    
    this.player = this.physics.add.sprite(100, this.game.config.height / 2, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.5);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.targets = this.physics.add.group();
    this.createTargets();

    this.physics.add.overlap(this.player, this.targets, this.collectTarget, null, this);

    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    this.fuelText = this.add.text(16, 50, 'Fuel: 1000', { fontSize: '32px', fill: '#000' });

    this.dudeState = Vector.create([this.player.x, 0, -this.player.y, 0]);

    this.Ad = Matrix.create([
      [1, this.Te, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, this.Te],
      [0, 0, 0, 1]
    ]);

    this.Bd = Matrix.create([
      [0.5 * this.Te * this.Te, 0],
      [this.Te, 0],
      [0, 0.5 * this.Te * this.Te],
      [0, this.Te]
    ]);

    this.time.addEvent({ delay: this.Te * 1000, callback: this.updateState, callbackScope: this, loop: true });
  }

  update() {
    this.handleInput();
    this.updateFuelDisplay();
  }

  handleInput() {
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
  }

  applyThrust(thrust) {
    if (this.fuel > 0) {
      const fuelConsumption = Math.sqrt(thrust.x * thrust.x + thrust.y * thrust.y) * this.Te;
      this.fuel = Math.max(0, this.fuel - fuelConsumption);

      const Un = Vector.create([thrust.x, thrust.y + this.gravity]);
      this.dudeState = this.Ad.multiply(this.dudeState).add(this.Bd.multiply(Un).multiply(this.erg / this.player.body.mass));
    }
  }

  updateState() {
    this.player.setPosition(this.dudeState.e(1), -this.dudeState.e(3));
    this.player.setVelocity(this.dudeState.e(2), -this.dudeState.e(4));
  }

  createTargets() {
    const targetPositions = [
      { x: 500, y: 250 }, { x: 800, y: 200 }, { x: 1300, y: 500 },
      { x: 1800, y: 300 }, { x: 2400, y: 350 }, { x: 2900, y: 400 }
    ];

    targetPositions.forEach(pos => {
      const target = this.targets.create(pos.x, pos.y, 'target');
      target.setScale(0.13);
    });
  }

  collectTarget(player, target) {
    target.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);

    if (this.targets.countActive(true) === 0) {
      this.createTargets();
    }
  }

  updateFuelDisplay() {
    this.fuelText.setText('Fuel: ' + Math.round(this.fuel));
  }
}

export default FlyingDudes;
