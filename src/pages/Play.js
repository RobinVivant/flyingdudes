import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import FlyingDudes from '../game/FlyingDudes';

function Play() {
  const gameRef = useRef(null);
  const [gameInstance, setGameInstance] = useState(null);
  const [score, setScore] = useState(0);
  const [fuel, setFuel] = useState(1000);
  const [targetsReached, setTargetsReached] = useState(0);
  const [fuelConsumed, setFuelConsumed] = useState(0);

  useEffect(() => {
    const updateGameSize = () => {
      if (gameRef.current) {
        const width = Math.min(800, gameRef.current.clientWidth);
        const height = width * 0.75; // Maintain 4:3 aspect ratio

        const config = {
          type: Phaser.AUTO,
          width: width,
          height: height,
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

        if (gameInstance) {
          gameInstance.destroy(true);
        }

        const game = new Phaser.Game(config);
        setGameInstance(game);

        const updateGameState = () => {
          const scene = game.scene.getScene('FlyingDudes');
          if (scene) {
            setScore(scene.score);
            setFuel(Math.round(scene.mfuel));
            setTargetsReached(scene.TargetsReached);
            setFuelConsumed(scene.cConso);
          }
        };

        const interval = setInterval(updateGameState, 100);

        return () => {
          clearInterval(interval);
          game.destroy(true);
        };
      }
    };

    updateGameSize();
    window.addEventListener('resize', updateGameSize);

    return () => {
      window.removeEventListener('resize', updateGameSize);
      if (gameInstance) {
        gameInstance.destroy(true);
      }
    };
  }, [gameInstance]);

  const handleReset = () => {
    if (gameInstance) {
      const scene = gameInstance.scene.getScene('FlyingDudes');
      if (scene) {
        scene.actionOnReset();
      }
    }
  };

  const handleAutoMode = () => {
    if (gameInstance) {
      const scene = gameInstance.scene.getScene('FlyingDudes');
      if (scene) {
        scene.actionOnAutoMode();
      }
    }
  };

  return (
    <div className="play-container">
      <h2>The Flying Dude's Adventure</h2>
      <div className="game-info">
        <p>Score: {score}</p>
        <p>Fuel: {fuel}</p>
        <p>Targets: {targetsReached}/6</p>
        <p>Fuel Used: {fuelConsumed.toFixed(2)}</p>
      </div>
      <div className="game-controls">
        <button onClick={handleReset}>Reset Game</button>
        <button onClick={handleAutoMode}>Auto Mode</button>
      </div>
      <div ref={gameRef} id="game-container"></div>
      <div className="game-instructions">
        <h3>How to Play:</h3>
        <ul>
          <li>Use arrow keys to guide The Dude through the air</li>
          <li>Collect floating targets to increase your score</li>
          <li>Keep an eye on your fuel - don't run out!</li>
          <li>Press 'R' to reset the game at any time</li>
          <li>Try 'A' to activate auto mode and watch The Dude fly solo</li>
        </ul>
      </div>
    </div>
  );
}

export default Play;
