import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import FlyingDudes from '../game/FlyingDudes';

function Play() {
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: [FlyingDudes]
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div className="play-container">
      <h2>Flying Dudes Game</h2>
      <div ref={gameRef} id="game-container"></div>
    </div>
  );
}

export default Play;
