import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="inner cover">
      <h1 className="cover-heading">Les Dudes Volants !</h1>
      <p className="lead">
        Projet SI4 2014 pour le cours de Contrôle Informatique supervisé par 
        <a href="mailto:strombon@polytech.unice.fr">Jean-Paul Stromboni</a>.
      </p>
      <p className="lead">
        <Link to="/play" className="btn btn-lg btn-default">Viens jouer, mec !</Link>
      </p>
    </div>
  );
}

export default Home;
