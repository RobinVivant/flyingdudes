import Phaser from 'phaser';

class FlyingDudes extends Phaser.Scene {
  constructor() {
    super('FlyingDudes');
    this.player = null;
    this.cursors = null;
    this.score = 0;
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
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
    } else {
      this.player.setVelocityY(0);
    }
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
}

export default FlyingDudes;
