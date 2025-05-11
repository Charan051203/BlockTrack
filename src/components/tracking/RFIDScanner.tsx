import React, { useState } from 'react';
import { Wifi, X, Check, AlertTriangle, Wallet } from 'lucide-react';
import { useBlockchain } from '../../contexts/BlockchainContext';
import { useSupplyChain } from '../../contexts/SupplyChainContext';

interface RFIDScannerProps {
  onProductFound?: (product: any) => void;
}

const RFIDScanner: React.FC<RFIDScannerProps> = ({ onProductFound }) => {
  const [rfidInput, setRfidInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null);
  const [scanMessage, setScanMessage] = useState('');
  
  const { verifyProduct, isConnected, connectWallet } = useBlockchain();
  const { trackProduct } = useSupplyChain();
  
  const handleStartScan = async () => {
    if (!rfidInput.trim()) return;
    
    setIsScanning(true);
    setScanResult(null);
    setScanMessage('');

    try {
      // First try to find the product in the local system
      const product = trackProduct(rfidInput);
      
      if (!product) {
        setScanResult('error');
        setScanMessage('Product not found in the system.');
        return;
      }

      // If wallet is not connected, try to connect it first
      if (!isConnected) {
        const connected = await connectWallet();
        if (!connected) {
          setScanResult('success');
          setScanMessage(`Product found: ${product.name} (Connect wallet for blockchain verification)`);
          if (onProductFound) onProductFound(product);
          return;
        }
      }

      // Attempt blockchain verification
      try {
        const blockchainVerified = await verifyProduct(product.id);
        
        if (blockchainVerified) {
          setScanResult('success');
          setScanMessage(`Product verified: ${product.name}`);
          if (onProductFound) onProductFound(product);
        } else {
          setScanResult('success');
          setScanMessage(`Product found: ${product.name} (Blockchain verification pending)`);
          if (onProductFound) onProductFound(product);
        }
      } catch (error) {
        console.warn('Blockchain verification error:', error);
        setScanResult('success');
        setScanMessage(`Product found: ${product.name} (Blockchain verification failed)`);
        if (onProductFound) onProductFound(product);
      }
    } catch (error) {
      console.error('RFID scan error:', error);
      setScanResult('error');
      setScanMessage('Error scanning RFID tag.');
    } finally {
      setIsScanning(false);
    }
  };
  
  const handleReset = () => {
    setRfidInput('');
    setScanResult(null);
    setScanMessage('');
  };
  
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">RFID Scanner</h3>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isScanning ? 'bg-warning-500 animate-pulse' : scanResult === 'success' ? 'bg-success-500' : scanResult === 'error' ? 'bg-error-500' : 'bg-neutral-300'}`}></div>
          {!isConnected && (
            <button
              onClick={connectWallet}
              className="flex items-center text-warning-600 hover:text-warning-700 text-sm"
            >
              <Wallet size={16} className="mr-1" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Wifi size={18} className="text-neutral-400" />
          </div>
          
          <input
            type="text"
            value={rfidInput}
            onChange={(e) => setRfidInput(e.target.value)}
            placeholder="Enter RFID tag (e.g., 0xABCD1234...)"
            className="pl-10 pr-4 py-2 w-full border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            disabled={isScanning}
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleStartScan}
            disabled={isScanning || !rfidInput.trim()}
            className={`btn flex-1 ${
              isScanning
                ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed' 
                : 'bg-primary-500 text-white hover:bg-primary-600'
            }`}
          >
            {isScanning ? 'Scanning...' : 'Scan RFID'}
          </button>
          
          <button
            onClick={handleReset}
            disabled={isScanning || (!rfidInput && !scanResult)}
            className="btn bg-neutral-200 text-neutral-800 hover:bg-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={18} />
          </button>
        </div>
        
        {isScanning && (
          <div className="flex justify-center py-2">
            <div className="rfid-pulse flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full">
              <Wifi size={32} className="text-white z-10" />
            </div>
          </div>
        )}
        
        {scanResult && (
          <div className={`flex items-center p-4 rounded-md ${
            scanResult === 'success' ? 'bg-success-50 text-success-800' : 'bg-error-50 text-error-800'
          }`}>
            {scanResult === 'success' ? (
              <Check size={20} className="mr-2 flex-shrink-0" />
            ) : (
              <AlertTriangle size={20} className="mr-2 flex-shrink-0" />
            )}
            <span>{scanMessage}</span>
          </div>
        )}

        {!isConnected && !scanResult && (
          <div className="flex items-center p-4 rounded-md bg-warning-50 text-warning-800">
            <AlertTriangle size={20} className="mr-2 flex-shrink-0" />
            <span>Connect wallet to verify product authenticity on the blockchain.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RFIDScanner;