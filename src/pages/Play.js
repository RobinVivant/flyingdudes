import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const Game = dynamic(() => import('../components/Game'), { ssr: false, loading: () => <p>Loading...</p> });

function Play() {
  const [gameState, setGameState] = useState({
    score: 0,
    fuel: 1000,
    targetsReached: 0,
    fuelConsumed: 0
  });

  const updateGameState = (newState) => {
    setGameState(newState);
  };

  return (
    <div className="play-container">
      <h2>L'Aventure du Dude Volant</h2>
      <div className="game-info">
        <p>Score : {gameState.score}</p>
        <p>Carburant : {gameState.fuel}</p>
        <p>Cibles : {gameState.targetsReached}/6</p>
        <p>Carburant utilisé : {gameState.fuelConsumed.toFixed(2)}</p>
      </div>
      <Game updateGameState={updateGameState} />
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
