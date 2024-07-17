import Phaser from 'phaser';

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
  }

  // Helper functions for vector and matrix operations
  createVector(elements) {
    return elements;
  }

  createMatrix(rows) {
    return rows;
  }

  multiplyMatrixVector(matrix, vector) {
    return matrix.map(row => 
      row.reduce((sum, value, index) => sum + value * vector[index], 0)
    );
  }

  multiplyMatrices(matrix1, matrix2) {
    return matrix1.map(row => 
      matrix2[0].map((_, colIndex) => 
        row.reduce((sum, cell, rowIndex) => sum + cell * matrix2[rowIndex][colIndex], 0)
      )
    );
  }

  addVectors(vector1, vector2) {
    return vector1.map((value, index) => value + vector2[index]);
  }

  subtractVectors(vector1, vector2) {
    return vector1.map((value, index) => value - vector2[index]);
  }

  multiplyVectorByScalar(vector, scalar) {
    return vector.map(value => value * scalar);
  }

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
    
    this.player = this.physics.add.sprite(100, this.game.config.height / 2, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.5);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.targets = this.physics.add.group();
    this.createTargets();

    this.physics.add.overlap(this.player, this.targets, this.collectTarget, null, this);

    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    this.fuelText = this.add.text(16, 50, 'Fuel: 1000', { fontSize: '32px', fill: '#000' });

    this.dudeState = this.createVector([this.player.x, 0, -this.player.y, 0]);

    this.Ad = this.createMatrix([
      [1, this.Te, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, this.Te],
      [0, 0, 0, 1]
    ]);

    this.Bd = this.createMatrix([
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
    this.handleInput();
    this.updateFuelDisplay();
    this.updateAutoMode();
    this.observState();
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

      const Un = this.createVector([thrust.x, thrust.y + this.gravity]);
      const adMultiplyDudeState = this.multiplyMatrixVector(this.Ad, this.dudeState);
      const bdMultiplyUn = this.multiplyMatrixVector(this.Bd, Un);
      const scaledBdMultiplyUn = this.multiplyVectorByScalar(bdMultiplyUn, this.erg / this.m);
      this.dudeState = this.addVectors(adMultiplyDudeState, scaledBdMultiplyUn);
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

    const Xh = this.createVector([goalPos[0], 0, goalPos[1], 0]);

    // Calcul de la matrice de gouvernabilité G
    let G = this.Bd;
    for (let n = 1; n < this.h; n++) {
      const tmpAd = this.power(this.Ad, n);
      G = this.augmentMatrix(this.multiplyMatrices(tmpAd, this.Bd), G);
    }

    if (this.matrixRank(G) < this.Ad.length) {
      console.log("Erreur : Pas de solutions");
    } else {
      const y = this.subtractVectors(Xh, this.multiplyMatrixVector(this.power(this.Ad, this.h), posDude));
      const Gt = this.transposeMatrix(G);
      const GGtInverse = this.inverseMatrix(this.multiplyMatrices(G, Gt));
      this.dataBoucleOuverte.uCom = this.multiplyMatrices(this.multiplyMatrices(Gt, GGtInverse), [y]);
      this.dataBoucleOuverte.isRunning = true;
    }
  }

  power(matrix, pow) {
    let res = matrix;
    for (let i = 1; i < pow; i++) {
      res = this.multiplyMatrices(res, matrix);
    }
    return res;
  }

  augmentMatrix(matrix1, matrix2) {
    return matrix1.map((row, i) => [...row, ...matrix2[i]]);
  }

  transposeMatrix(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  }

  matrixRank(matrix) {
    const epsilon = 1e-10; // Threshold for considering a value as zero
    let rank = 0;
    const rows = matrix.length;
    const cols = matrix[0].length;
    const rowEchelon = this.toRowEchelonForm(matrix);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (Math.abs(rowEchelon[i][j]) > epsilon) {
          rank++;
          break;
        }
      }
    }

    return rank;
  }

  toRowEchelonForm(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const result = matrix.map(row => [...row]);

    let lead = 0;
    for (let r = 0; r < rows; r++) {
      if (lead >= cols) return result;
      let i = r;
      while (result[i][lead] === 0) {
        i++;
        if (i === rows) {
          i = r;
          lead++;
          if (cols === lead) return result;
        }
      }
      [result[i], result[r]] = [result[r], result[i]];
      const lv = result[r][lead];
      result[r] = result[r].map(x => x / lv);
      for (let i = 0; i < rows; i++) {
        if (i !== r) {
          const lv = result[i][lead];
          result[i] = result[i].map((x, j) => x - lv * result[r][j]);
        }
      }
      lead++;
    }
    return result;
  }

  inverseMatrix(matrix) {
    const n = matrix.length;

    // Create an augmented matrix [A | I]
    const augmented = matrix.map((row, i) => 
      [...row, ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)]
    );

    // Convert to reduced row echelon form
    const rref = this.toReducedRowEchelonForm(augmented);

    // Extract the right half of the matrix, which is now A^-1
    return rref.map(row => row.slice(n));
  }

  toReducedRowEchelonForm(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const result = matrix.map(row => [...row]);

    let lead = 0;
    for (let r = 0; r < rows; r++) {
      if (lead >= cols) return result;
      let i = r;
      while (result[i][lead] === 0) {
        i++;
        if (i === rows) {
          i = r;
          lead++;
          if (cols === lead) return result;
        }
      }
      [result[i], result[r]] = [result[r], result[i]];
      const lv = result[r][lead];
      result[r] = result[r].map(x => x / lv);
      for (let i = 0; i < rows; i++) {
        if (i !== r) {
          const lv = result[i][lead];
          result[i] = result[i].map((x, j) => x - lv * result[r][j]);
        }
      }
      lead++;
    }
    return result;
  }
}

export default FlyingDudes;
