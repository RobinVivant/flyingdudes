import React from 'react';
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <header className="masthead">
      <div className="inner">
        <h1 className="masthead-brand">Les Dudes Volants</h1>
        <nav className="nav-container">
          <NavLink to="/" className="nav-link">Accueil</NavLink>
          <NavLink to="/play" className="nav-link">Jouer</NavLink>
          <NavLink to="/about" className="nav-link">À propos</NavLink>
          <NavLink to="/leroux" className="nav-link">Leroux</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
