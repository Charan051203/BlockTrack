import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import { BlockchainProvider } from './contexts/BlockchainContext';
import { SupplyChainProvider } from './contexts/SupplyChainContext';
import { AuthProvider } from './contexts/AuthContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <BlockchainProvider>
          <SupplyChainProvider>
            <App />
          </SupplyChainProvider>
        </BlockchainProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
);