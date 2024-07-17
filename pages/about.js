import React from 'react';
import About from '../src/pages/About';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';

function AboutPage() {
  return (
    <div className="site-wrapper">
      <div className="site-wrapper-inner">
        <div className="cover-container">
          <Header />
          <About />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
