import React, { useState } from 'react';
import { Package, Scan, AlertTriangle } from 'lucide-react';
import RFIDScanner from '../components/tracking/RFIDScanner';
import ProductDetails from '../components/tracking/ProductDetails';
import BlockchainTransactions from '../components/tracking/BlockchainTransactions';
import { useBlockchain } from '../contexts/BlockchainContext';

const ProductTracking: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { isConnected } = useBlockchain();
  
  const handleProductFound = (product: any) => {
    setSelectedProduct(product);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Product Tracking</h1>
          <p className="text-neutral-500 mt-1">Track products using RFID tags and view blockchain records</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <RFIDScanner onProductFound={handleProductFound} />
          
          {!isConnected && (
            <div className="card bg-warning-50 p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="text-warning-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-medium text-warning-800">Wallet Not Connected</h3>
                  <p className="text-sm text-warning-700 mt-1">
                    Connect your wallet to verify products on the blockchain and prevent counterfeits.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {selectedProduct && (
            <BlockchainTransactions productId={selectedProduct.id} />
          )}
        </div>
        
        <div className="lg:col-span-2">
          <ProductDetails 
            product={selectedProduct} 
            onProductUpdated={(updatedProduct) => setSelectedProduct(updatedProduct)} 
          />
          
          {!selectedProduct && (
            <div className="card flex flex-col items-center justify-center py-10">
              <div className="w-16 h-16 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full mb-3">
                <Scan size={32} />
              </div>
              <p className="text-lg font-medium text-neutral-800 mb-2">Scan an RFID Tag</p>
              <p className="text-neutral-500 text-center max-w-md mb-6">
                Use the RFID scanner to scan a product tag and view detailed tracking information.
              </p>
              <div className="text-sm text-neutral-500 font-mono bg-neutral-50 p-2 rounded">
                Sample RFID: 0xABCD1234EFGH5678
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductTracking;