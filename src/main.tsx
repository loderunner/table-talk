import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';

import 'unfonts.css';
import './index.css';
// import './markdown.css';

createRoot(document.body).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
