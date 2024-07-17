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
    createGame();
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
      <h2>L'Aventure du Dude Volant</h2>
      <div className="game-info">
        <p>Score : {gameState.score}</p>
        <p>Carburant : {gameState.fuel}</p>
        <p>Cibles : {gameState.targetsReached}/6</p>
        <p>Carburant utilisé : {gameState.fuelConsumed.toFixed(2)}</p>
      </div>
      <div className="game-controls">
        <button onClick={handleReset}>Réinitialiser le jeu</button>
        <button onClick={handleAutoMode}>Mode Auto</button>
      </div>
      <div ref={gameRef} id="game-container"></div>
      <div className="game-instructions">
        <h3>Comment jouer :</h3>
        <ul>
          <li>Utilisez les flèches du clavier pour guider Le Dude dans les airs</li>
          <li>Collectez les cibles flottantes pour augmenter votre score</li>
          <li>Gardez un œil sur votre carburant - ne tombez pas en panne !</li>
          <li>Appuyez sur 'R' pour réinitialiser le jeu à tout moment</li>
          <li>Essayez 'A' pour activer le mode auto et regardez Le Dude voler en solo</li>
        </ul>
      </div>
    </div>
  );
}

export default Play;
