import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, MemoryRouter} from 'react-router-dom';
import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import '@astryxdesign/theme-neutral/theme.css';
import './brand.css';
import App from './App';

// The published Artifact only supports plain #name hashes, so it runs on in-memory routing.
const Router = import.meta.env.VITE_MEMORY_ROUTER ? MemoryRouter : BrowserRouter;

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element in index.html');

createRoot(root).render(
  <StrictMode>
    <Router basename={import.meta.env.VITE_MEMORY_ROUTER ? undefined : import.meta.env.BASE_URL}>
      <App />
    </Router>
  </StrictMode>,
);
