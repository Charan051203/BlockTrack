import React, { useState } from 'react';
import { Wifi, Plus, BarChart4, AlertTriangle, X } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import { useSupplyChain } from '../contexts/SupplyChainContext';
import { formatDate } from '../utils/dateUtils';

const RFIDManagement: React.FC = () => {
  const { products, addProduct, participants } = useSupplyChain();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showSensorData, setShowSensorData] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newRFID, setNewRFID] = useState({
    name: '',
    rfidTag: '',
    manufacturer: '',
    currentLocation: {
      name: '',
      latitude: 0,
      longitude: 0
    },
    status: 'manufactured' as const,
    temperature: 22,
    humidity: 45
  });
  
  const handleRegisterRFID = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProduct(newRFID);
      setShowRegisterModal(false);
      setNewRFID({
        name: '',
        rfidTag: '',
        manufacturer: '',
        currentLocation: {
          name: '',
          latitude: 0,
          longitude: 0
        },
        status: 'manufactured',
        temperature: 22,
        humidity: 45
      });
    } catch (error) {
      console.error('Failed to register RFID:', error);
    }
  };

  const manufacturers = participants
    .filter(p => p.role === 'manufacturer')
    .map(p => p.name);
  
  // Generate random sensor data for simulation purposes
  const generateRandomData = () => {
    const data = [];
    const now = Date.now();
    
    for (let i = 0; i < 24; i++) {
      data.push({
        time: now - (23 - i) * 60 * 60 * 1000,
        temperature: Math.round((22 + Math.random() * 3) * 10) / 10,
        humidity: Math.round((45 + Math.random() * 10) * 10) / 10,
      });
    }
    
    return data;
  };
  
  const [sensorData] = useState(generateRandomData());
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">RFID Management</h1>
          <p className="text-neutral-500 mt-1">Manage and monitor RFID tags across your supply chain</p>
        </div>
        
        <button 
          className="btn-primary flex items-center space-x-2"
          onClick={() => setShowRegisterModal(true)}
        >
          <Plus size={18} />
          <span>Register New RFID</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">RFID Tags</h3>
            
            <div className="space-y-1 max-h-[600px] overflow-y-auto pr-2">
              {products.map(product => (
                <div
                  key={product.id}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedProduct?.id === product.id
                      ? 'bg-primary-50 border border-primary-200'
                      : 'hover:bg-neutral-50 border border-transparent'
                  }`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`mt-0.5 h-2 w-2 rounded-full ${
                        product.status === 'in-transit' 
                          ? 'bg-warning-500 animate-pulse' 
                          : 'bg-success-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-neutral-500 font-mono mt-0.5">
                          {product.rfidTag}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={product.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          {selectedProduct ? (
            <div className="space-y-6">
              <div className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{selectedProduct.name}</h3>
                    <div className="flex items-center mt-1 space-x-2">
                      <StatusBadge status={selectedProduct.status} />
                      <span className="text-sm text-neutral-500">
                        Last updated {formatDate(selectedProduct.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-2.5 bg-primary-50 rounded-md text-primary-600">
                    <Wifi size={24} />
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-neutral-50 rounded-md">
                      <p className="text-sm text-neutral-500">RFID Tag ID</p>
                      <p className="font-mono font-medium mt-1">{selectedProduct.rfidTag}</p>
                    </div>
                    
                    <div className="p-4 bg-neutral-50 rounded-md">
                      <p className="text-sm text-neutral-500">Current Location</p>
                      <p className="font-medium mt-1">{selectedProduct.currentLocation.name}</p>
                      <p className="text-sm text-neutral-500 mt-1">
                        Coordinates: {selectedProduct.currentLocation.latitude.toFixed(4)}, {selectedProduct.currentLocation.longitude.toFixed(4)}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-neutral-50 rounded-md">
                      <p className="text-sm text-neutral-500">Manufacturer</p>
                      <p className="font-medium mt-1">{selectedProduct.manufacturer}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {selectedProduct.temperature !== undefined && (
                      <div className="p-4 bg-neutral-50 rounded-md">
                        <p className="text-sm text-neutral-500">Current Temperature</p>
                        <div className="flex items-end mt-1">
                          <p className="text-2xl font-semibold">{selectedProduct.temperature}°C</p>
                          <p className="text-sm text-success-600 ml-2 mb-1">Normal</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedProduct.humidity !== undefined && (
                      <div className="p-4 bg-neutral-50 rounded-md">
                        <p className="text-sm text-neutral-500">Current Humidity</p>
                        <div className="flex items-end mt-1">
                          <p className="text-2xl font-semibold">{selectedProduct.humidity}%</p>
                          <p className="text-sm text-success-600 ml-2 mb-1">Normal</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4 bg-neutral-50 rounded-md">
                      <p className="text-sm text-neutral-500">Battery Status</p>
                      <div className="flex items-center mt-1">
                        <div className="w-full bg-neutral-200 rounded-full h-2.5 mr-2">
                          <div className="bg-success-500 h-2.5 rounded-full" style={{ width: '82%' }}></div>
                        </div>
                        <span className="text-sm font-medium text-neutral-700">82%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={() => setShowSensorData(!showSensorData)}
                    className="btn flex items-center space-x-2 bg-primary-50 text-primary-700 hover:bg-primary-100"
                  >
                    <BarChart4 size={18} />
                    <span>
                      {showSensorData ? 'Hide Sensor Data' : 'View Sensor Data'}
                    </span>
                  </button>
                  
                  <button className="btn flex items-center space-x-2 bg-error-50 text-error-700 hover:bg-error-100">
                    <AlertTriangle size={18} />
                    <span>Report Issue</span>
                  </button>
                </div>
              </div>
              
              {showSensorData && (
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Sensor Data (Last 24 Hours)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-neutral-50 rounded-md">
                      <p className="text-sm font-medium mb-3">Temperature (°C)</p>
                      <div className="h-60 flex items-end space-x-1">
                        {sensorData.map((data, index) => {
                          const height = (data.temperature - 20) * 20;
                          const isWarning = data.temperature > 24;
                          
                          return (
                            <div key={index} className="flex flex-col items-center flex-1">
                              <div 
                                className={`w-full rounded-t-sm ${isWarning ? 'bg-warning-500' : 'bg-primary-500'}`}
                                style={{ height: `${height}px` }}
                              ></div>
                              {index % 4 === 0 && (
                                <p className="text-xs text-neutral-500 mt-1">
                                  {new Date(data.time).getHours()}:00
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-neutral-50 rounded-md">
                      <p className="text-sm font-medium mb-3">Humidity (%)</p>
                      <div className="h-60 flex items-end space-x-1">
                        {sensorData.map((data, index) => {
                          const height = data.humidity * 1.2;
                          const isWarning = data.humidity > 50;
                          
                          return (
                            <div key={index} className="flex flex-col items-center flex-1">
                              <div 
                                className={`w-full rounded-t-sm ${isWarning ? 'bg-warning-500' : 'bg-accent-500'}`}
                                style={{ height: `${height}px` }}
                              ></div>
                              {index % 4 === 0 && (
                                <p className="text-xs text-neutral-500 mt-1">
                                  {new Date(data.time).getHours()}:00
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card flex flex-col items-center justify-center py-10">
              <div className="w-16 h-16 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full mb-3">
                <Wifi size={32} />
              </div>
              <p className="text-lg font-medium text-neutral-800 mb-2">Select an RFID Tag</p>
              <p className="text-neutral-500 text-center max-w-md">
                Select an RFID tag from the list to view its details and sensor data.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Register RFID Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Register New RFID Tag</h2>
              <button 
                onClick={() => setShowRegisterModal(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleRegisterRFID} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={newRFID.name}
                  onChange={(e) => setNewRFID({
                    ...newRFID,
                    name: e.target.value
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  RFID Tag ID
                </label>
                <input
                  type="text"
                  required
                  className="input font-mono"
                  placeholder="0xABCD1234..."
                  value={newRFID.rfidTag}
                  onChange={(e) => setNewRFID({
                    ...newRFID,
                    rfidTag: e.target.value
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Manufacturer
                </label>
                <select
                  className="select"
                  required
                  value={newRFID.manufacturer}
                  onChange={(e) => {
                    const manufacturer = participants.find(p => p.name === e.target.value);
                    setNewRFID({
                      ...newRFID,
                      manufacturer: e.target.value,
                      currentLocation: manufacturer ? {
                        name: manufacturer.name,
                        latitude: manufacturer.location.latitude,
                        longitude: manufacturer.location.longitude
                      } : newRFID.currentLocation
                    });
                  }}
                >
                  <option value="">Select Manufacturer</option>
                  {manufacturers.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Initial Temperature (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    className="input"
                    value={newRFID.temperature}
                    onChange={(e) => setNewRFID({
                      ...newRFID,
                      temperature: parseFloat(e.target.value)
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Initial Humidity (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    className="input"
                    value={newRFID.humidity}
                    onChange={(e) => setNewRFID({
                      ...newRFID,
                      humidity: parseFloat(e.target.value)
                    })}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="btn bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Register RFID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RFIDManagement;