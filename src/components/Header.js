import React from 'react';
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <div className="masthead clearfix">
      <div className="inner">
        <h3 className="masthead-brand"></h3>
        <nav>
          <ul className="nav masthead-nav">
            <li><NavLink to="/">Accueil</NavLink></li>
            <li><NavLink to="/play">Jouer</NavLink></li>
            <li><NavLink to="/about">A propos</NavLink></li>
            <li><NavLink to="/leroux">Leroux</NavLink></li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Header;
