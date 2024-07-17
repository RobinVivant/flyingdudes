import React from 'react';
import Link from 'next/link';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';

function Home() {
  return (
    <div className="site-wrapper" style={{
      backgroundImage: `url(/assets/sprites/background.png)`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center top',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      overflow: 'auto'
    }}>
      <div className="site-wrapper-inner">
        <div className="cover-container">
          <Header />
          <div className="inner cover">
            <h1 className="cover-heading">Les Dudes Volants !</h1>
            <p className="lead">
              Projet SI4 2014 pour le cours de Contrôle Informatique supervisé par 
              <a href="mailto:strombon@polytech.unice.fr"> Jean-Paul Stromboni</a>.
            </p>
            <p className="lead">
              <Link href="/play" className="btn btn-lg btn-default">Viens jouer, mec !</Link>
            </p>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Home;
