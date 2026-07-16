import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Self-hosted variable fonts (bundled by Vite — no external request, the
// hosted viewer lives behind the VPN).
import '@fontsource-variable/archivo';
import '@fontsource-variable/jetbrains-mono';
import { App } from './App.js';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
