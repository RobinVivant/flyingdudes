import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Play from './pages/Play';
import About from './pages/About';
import Leroux from './pages/Leroux';
import './App.css';

function App() {
  return (
    <div className="site-wrapper" style={{
      backgroundImage: `url(${process.env.PUBLIC_URL}/assets/sprites/background.png)`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      <div className="site-wrapper-inner">
        <div className="cover-container">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/play" element={<Play />} />
            <Route path="/about" element={<About />} />
            <Route path="/leroux" element={<Leroux />} />
            <Route path="/assets/*" element={<div>Assets</div>} />
          </Routes>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
