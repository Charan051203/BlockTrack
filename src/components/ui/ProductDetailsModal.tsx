import React from 'react';
import { X, Package, Clock, Building, MapPin, Thermometer, Droplets } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ProductQRCode from './ProductQRCode';
import { formatDate } from '../../utils/dateUtils';

interface ProductDetailsModalProps {
  product: any;
  onClose: () => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <div className="flex items-center mt-1 space-x-2">
              <StatusBadge status={product.status} />
              <span className="text-sm text-neutral-500">
                Last updated {formatDate(product.timestamp)}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 flex justify-center">
          <ProductQRCode product={product} size={200} />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex space-x-3 items-start">
              <div className="p-2 rounded-md bg-neutral-100 text-neutral-600">
                <Package size={18} />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Product ID</p>
                <p className="font-medium">{product.id}</p>
              </div>
            </div>

            <div className="flex space-x-3 items-start">
              <div className="p-2 rounded-md bg-neutral-100 text-neutral-600">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Manufactured Date</p>
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
                <p className="text-sm text-neutral-500 mt-1">
                  Coordinates: {product.currentLocation.latitude.toFixed(4)}, {product.currentLocation.longitude.toFixed(4)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
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
                <p className="font-medium font-mono">{product.rfidTag}</p>
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

        <div className="mt-6 pt-6 border-t border-neutral-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="btn bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            >
              Close
            </button>
            <a
              href={`/tracking?id=${product.id}`}
              className="btn-primary"
            >
              View Full Details
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;