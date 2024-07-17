import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

function Header() {
  const router = useRouter();

  return (
    <header className="masthead">
      <div className="inner">
        <h1 className="masthead-brand">Les Dudes Volants</h1>
        <nav className="nav-container">
          <Link href="/" className={`nav-link ${router.pathname === '/' ? 'active' : ''}`}>Accueil</Link>
          <Link href="/play" className={`nav-link ${router.pathname === '/play' ? 'active' : ''}`}>Jouer</Link>
          <Link href="/about" className={`nav-link ${router.pathname === '/about' ? 'active' : ''}`}>À propos</Link>
          <Link href="/leroux" className={`nav-link ${router.pathname === '/leroux' ? 'active' : ''}`}>Leroux</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
