import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap styles
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // <-- Required for dropdowns!

import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

// No ChakraProvider!
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
