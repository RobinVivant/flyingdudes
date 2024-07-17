import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  
  try {
    root.render(
      <React.StrictMode>
        <Router>
          <App />
        </Router>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Error rendering the app:', error);
  }
} else {
  console.error('Root element not found');
}

window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});
