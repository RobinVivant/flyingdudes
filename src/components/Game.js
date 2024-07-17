import React, { useEffect, useRef, useCallback, useState } from 'react';
import Phaser from 'phaser';
import FlyingDudes from '../game/FlyingDudes';

function Game({ updateGameState }) {
  const gameRef = useRef(null);
  const gameInstanceRef = useRef(null);
  const [isGameCreated, setIsGameCreated] = useState(false);

  const createGame = useCallback(() => {
    if (gameRef.current && !gameInstanceRef.current && !isGameCreated) {
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
      setIsGameCreated(true);
    }
  }, [isGameCreated]);

  const updateGameStateFromScene = useCallback(() => {
    if (gameInstanceRef.current) {
      const scene = gameInstanceRef.current.scene.getScene('FlyingDudes');
      if (scene) {
        updateGameState({
          score: scene.score,
          fuel: Math.round(scene.mfuel),
          targetsReached: scene.TargetsReached,
          fuelConsumed: scene.cConso
        });
      }
    }
  }, [updateGameState]);

  useEffect(() => {
    createGame();
    
    if (isGameCreated) {
      const interval = setInterval(updateGameStateFromScene, 100);

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
      };
    }
  }, [createGame, updateGameStateFromScene, isGameCreated]);

  useEffect(() => {
    return () => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
        setIsGameCreated(false);
      }
    };
  }, []);

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
    <div>
      <div className="game-controls">
        <button onClick={handleReset}>Réinitialiser le jeu</button>
        <button onClick={handleAutoMode}>Mode Auto</button>
      </div>
      <div ref={gameRef} id="game-container"></div>
    </div>
  );
}

export default Game;
