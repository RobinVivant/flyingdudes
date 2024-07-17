import React from 'react';
import { useRouter } from 'next/router';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Play from './pages/Play';
import About from './pages/About';
import Leroux from './pages/Leroux';
import '../styles/globals.css';

function App() {
  const router = useRouter();

  let Component;
  switch(router.pathname) {
    case '/':
      Component = Home;
      break;
    case '/play':
      Component = Play;
      break;
    case '/about':
      Component = About;
      break;
    case '/leroux':
      Component = Leroux;
      break;
    default:
      Component = Home;
  }

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
          <Component />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
