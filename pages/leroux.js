import React from 'react';
import Leroux from '../src/pages/Leroux';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';

function LerouxPage() {
  return (
    <div className="site-wrapper">
      <div className="site-wrapper-inner">
        <div className="cover-container">
          <Header />
          <Leroux />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default LerouxPage;
