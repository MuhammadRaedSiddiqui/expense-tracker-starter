import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { initSentry } from './lib/sentry';
import { initPostHog } from './lib/posthog';

// Initialize monitoring tools
initSentry();
initPostHog();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
