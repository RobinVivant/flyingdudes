import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import '../styles/globals.css';

function App({ Component, pageProps }) {
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
          <Component {...pageProps} />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
