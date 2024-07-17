import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="inner cover">
      <h1 className="cover-heading">The Flying Dudes!</h1>
      <p className="lead">
        Project SI4 2014 for the Computer Control course supervised by 
        <a href="mailto:strombon@polytech.unice.fr">Jean-Paul Stromboni</a>.
      </p>
      <p className="lead">
        <Link to="/play" className="btn btn-lg btn-default">Come play, dude!</Link>
      </p>
    </div>
  );
}

export default Home;
