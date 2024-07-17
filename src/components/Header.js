import React from 'react';
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <header className="masthead">
      <div className="inner">
        <h1 className="masthead-brand">Flying Dudes</h1>
        <nav className="nav-container">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/play" className="nav-link">Play</NavLink>
          <NavLink to="/about" className="nav-link">About</NavLink>
          <NavLink to="/leroux" className="nav-link">Leroux</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
