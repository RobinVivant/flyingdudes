import React, { useEffect, useRef, useState, useCallback } from 'react';
import Phaser from 'phaser';
import FlyingDudes from '../game/FlyingDudes';

function Play() {
  const gameRef = useRef(null);
  const gameInstanceRef = useRef(null);
  const [gameState, setGameState] = useState({
    score: 0,
    fuel: 1000,
    targetsReached: 0,
    fuelConsumed: 0
  });

  const createGame = useCallback(() => {
    if (gameRef.current && !gameInstanceRef.current) {
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

      gameInstanceRef.current = new Phaser.Game(config);
    }
  }, []);

  const updateGameState = useCallback(() => {
    if (gameInstanceRef.current) {
      const scene = gameInstanceRef.current.scene.getScene('FlyingDudes');
      if (scene) {
        setGameState({
          score: scene.score,
          fuel: Math.round(scene.mfuel),
          targetsReached: scene.TargetsReached,
          fuelConsumed: scene.cConso
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!gameInstanceRef.current) {
      createGame();
    }
    const interval = setInterval(updateGameState, 100);

    const handleResize = () => {
      if (gameInstanceRef.current) {
        const width = Math.min(800, gameRef.current.clientWidth);
        const height = width * 0.75;
        gameInstanceRef.current.scale.resize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }
    };
  }, [createGame, updateGameState]);

  const handleReset = useCallback(() => {
    if (gameInstanceRef.current) {
      const scene = gameInstanceRef.current.scene.getScene('FlyingDudes');
      if (scene) {
        scene.actionOnReset();
      }
    }
  }, []);

  const handleAutoMode = useCallback(() => {
    if (gameInstanceRef.current) {
      const scene = gameInstanceRef.current.scene.getScene('FlyingDudes');
      if (scene) {
        scene.actionOnAutoMode();
      }
    }
  }, []);

  return (
    <div className="play-container">
      <h2>The Flying Dude's Adventure</h2>
      <div className="game-info">
        <p>Score: {gameState.score}</p>
        <p>Fuel: {gameState.fuel}</p>
        <p>Targets: {gameState.targetsReached}/6</p>
        <p>Fuel Used: {gameState.fuelConsumed.toFixed(2)}</p>
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
