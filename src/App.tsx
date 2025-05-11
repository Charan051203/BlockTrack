import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ProductTracking from './pages/ProductTracking';
import SupplyChainMap from './pages/SupplyChainMap';
import Inventory from './pages/Inventory';
import Participants from './pages/Participants';
import RFIDManagement from './pages/RFIDManagement';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { useAuth } from './contexts/AuthContext';
import LoadingScreen from './components/ui/LoadingScreen';
import { PaymentProvider } from './contexts/PaymentContext';

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !appReady) {
    return <LoadingScreen />;
  }

  return (
    <PaymentProvider>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tracking" element={<ProductTracking />} />
            <Route path="/map" element={<SupplyChainMap />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/participants" element={<Participants />} />
            <Route path="/rfid" element={<RFIDManagement />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </PaymentProvider>
  );
}

export default App;