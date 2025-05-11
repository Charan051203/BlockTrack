import React, { useState } from 'react';
import { Package, Clock, Building, MapPin, Thermometer, Droplets, Check, Edit2, X } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import ProductQRCode from '../ui/ProductQRCode';
import { formatDate } from '../../utils/dateUtils';
import { useSupplyChain } from '../../contexts/SupplyChainContext';
import { useBlockchain } from '../../contexts/BlockchainContext';

interface ProductDetailsProps {
  product: any;
  onProductUpdated?: (product: any) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onProductUpdated }) => {
  const { updateProductStatus } = useSupplyChain();
  const { isConnected } = useBlockchain();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  const statusOptions = [
    { value: 'manufactured', label: 'Manufactured' },
    { value: 'in-transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'sold', label: 'Sold' }
  ];

  const handleStatusChange = async () => {
    if (!selectedStatus || !product) return;
    
    setUpdating(true);
    try {
      await updateProductStatus(product.id, selectedStatus);
      if (onProductUpdated) {
        onProductUpdated({
          ...product,
          status: selectedStatus,
          timestamp: Date.now()
        });
      }
      setShowStatusModal(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (!product) {
    return (
      <div className="card text-center py-10">
        <p className="text-neutral-500">No product selected. Use the RFID scanner to find a product.</p>
      </div>
    );
  }

  return (
    <div className="card space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold">{product.name}</h3>
          <div className="flex items-center mt-1 space-x-2">
            <StatusBadge status={product.status} />
            {isConnected && (
              <button
                onClick={() => setShowStatusModal(true)}
                className="text-neutral-500 hover:text-primary-600 p-1 rounded-md hover:bg-primary-50 transition-colors"
                title="Update Status"
              >
                <Edit2 size={14} />
              </button>
            )}
            <span className="text-sm text-neutral-500">
              Last updated {formatDate(product.timestamp)}
            </span>
          </div>
        </div>
        <div className="p-2.5 bg-primary-50 rounded-md text-primary-600">
          <Package size={24} />
        </div>
      </div>

      <div className="flex justify-center py-4 border-t border-b border-neutral-200">
        <ProductQRCode product={product} size={200} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex space-x-3 items-start">
            <div className="p-2 rounded-md bg-neutral-100 text-neutral-600">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Manufactured</p>
              <p className="font-medium">
                {formatDate(product.timestamp - 15 * 24 * 60 * 60 * 1000)}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3 items-start">
            <div className="p-2 rounded-md bg-neutral-100 text-neutral-600">
              <Building size={18} />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Manufacturer</p>
              <p className="font-medium">{product.manufacturer}</p>
            </div>
          </div>
          
          <div className="flex space-x-3 items-start">
            <div className="p-2 rounded-md bg-neutral-100 text-neutral-600">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Current Location</p>
              <p className="font-medium">{product.currentLocation.name}</p>
              <p className="text-xs text-neutral-500 mt-1">
                {product.currentLocation.latitude.toFixed(4)}, {product.currentLocation.longitude.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex space-x-3 items-start">
            <div className="p-2 rounded-md bg-neutral-100 text-neutral-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6v12H4V6l8-3 8 3Z" />
                <path d="M12 11h.01" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-neutral-500">RFID Tag</p>
              <p className="font-medium font-mono text-sm">{product.rfidTag}</p>
            </div>
          </div>
          
          {product.temperature !== undefined && (
            <div className="flex space-x-3 items-start">
              <div className="p-2 rounded-md bg-neutral-100 text-neutral-600">
                <Thermometer size={18} />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Temperature</p>
                <p className="font-medium">{product.temperature}°C</p>
              </div>
            </div>
          )}
          
          {product.humidity !== undefined && (
            <div className="flex space-x-3 items-start">
              <div className="p-2 rounded-md bg-neutral-100 text-neutral-600">
                <Droplets size={18} />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Humidity</p>
                <p className="font-medium">{product.humidity}%</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-3">Product Journey</h4>
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-3 w-0.5 bg-neutral-200 z-0"></div>
          
          <div className="relative z-10 space-y-4">
            {statusOptions.map((status, index) => {
              const isCompleted = statusOptions
                .slice(0, statusOptions.findIndex(s => s.value === product.status) + 1)
                .map(s => s.value)
                .includes(status.value);
              
              return (
                <div key={status.value} className="flex items-start">
                  <div className={`flex-shrink-0 h-6 w-6 rounded-full ${
                    isCompleted 
                      ? 'bg-success-500 flex items-center justify-center' 
                      : 'bg-neutral-200'
                  }`}>
                    {isCompleted && <Check size={14} className="text-white" />}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium">{status.label}</p>
                    {isCompleted && status.value === product.status && (
                      <p className="text-xs text-neutral-500">
                        {formatDate(product.timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Update Product Status</h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {statusOptions.map((status) => (
                <label
                  key={status.value}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedStatus === status.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={status.value}
                    checked={selectedStatus === status.value}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{status.label}</p>
                    <p className="text-sm text-neutral-500">
                      {status.value === product.status ? 'Current Status' : ''}
                    </p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedStatus === status.value
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-neutral-300'
                  }`}>
                    {selectedStatus === status.value && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </label>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowStatusModal(false)}
                className="btn bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusChange}
                disabled={!selectedStatus || selectedStatus === product.status || updating}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;