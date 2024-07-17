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
  }, []);

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
      <h2>Flying Dudes Game</h2>
      <div className="game-info">
        <p>Score: {score}</p>
        <p>Fuel: {fuel}</p>
        <p>Targets Reached: {targetsReached}/6</p>
        <p>Fuel Consumed: {fuelConsumed.toFixed(2)}</p>
        <button onClick={handleReset}>Reset Game</button>
        <button onClick={handleAutoMode}>Auto Mode</button>
      </div>
      <div ref={gameRef} id="game-container"></div>
      <div className="game-instructions">
        <h3>Instructions:</h3>
        <ul>
          <li>Use arrow keys to control the dude</li>
          <li>Collect targets to increase your score</li>
          <li>Watch your fuel consumption!</li>
          <li>Press 'R' to reset the game</li>
          <li>Press 'A' to activate auto mode</li>
        </ul>
      </div>
    </div>
  );
}

export default Play;
