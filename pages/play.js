import React from 'react';
import Play from '../src/pages/Play';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';

function PlayPage() {
  return (
    <div className="site-wrapper">
      <div className="site-wrapper-inner">
        <div className="cover-container">
          <Header />
          <Play />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default PlayPage;
