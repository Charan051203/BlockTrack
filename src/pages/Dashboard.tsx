import React, { useState } from 'react';
import { Package, ArrowRight, X } from 'lucide-react';
import SupplyChainStats from '../components/dashboard/SupplyChainStats';
import SupplyChainVisualization from '../components/dashboard/SupplyChainVisualization';
import RecentActivity from '../components/dashboard/RecentActivity';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { useSupplyChain } from '../contexts/SupplyChainContext';
import { useAuth } from '../contexts/AuthContext';
import StatusBadge from '../components/ui/StatusBadge';
import { formatDate } from '../utils/dateUtils';

const Dashboard: React.FC = () => {
  const { loading, participants, addProduct, products, stats } = useSupplyChain();
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProduct, setNewProduct] = useState({
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

  const handleStatsClick = (type: string) => {
    setSelectedType(type);
    setShowListModal(true);
  };

  const getFilteredItems = () => {
    if (!selectedType) return [];
    
    let items = [];
    switch (selectedType) {
      case 'products':
        items = products;
        break;
      case 'in-transit':
        items = products.filter(p => p.status === 'in-transit');
        break;
      case 'delivered':
        items = products.filter(p => p.status === 'delivered');
        break;
      case 'partners':
        items = participants;
        break;
      default:
        return [];
    }

    if (!searchTerm) return items;

    const search = searchTerm.toLowerCase();
    return items.filter(item => {
      if ('rfidTag' in item) { // Product
        return (
          item.name.toLowerCase().includes(search) ||
          item.rfidTag.toLowerCase().includes(search) ||
          item.manufacturer.toLowerCase().includes(search) ||
          item.currentLocation.name.toLowerCase().includes(search)
        );
      } else { // Participant
        return (
          item.name.toLowerCase().includes(search) ||
          item.role.toLowerCase().includes(search) ||
          item.location.address.toLowerCase().includes(search)
        );
      }
    });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProduct(newProduct);
      setShowAddModal(false);
      setNewProduct({
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
      console.error('Failed to add product:', error);
    }
  };

  const manufacturers = participants
    .filter(p => p.role === 'manufacturer')
    .map(p => p.name);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-neutral-200 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-neutral-500 mt-1">Welcome back, {user?.name}</p>
        </div>
        
        <div className="hidden sm:block">
          <button 
            className="btn-primary flex items-center space-x-2"
            onClick={() => setShowAddModal(true)}
          >
            <Package size={18} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => handleStatsClick('products')}
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm">Total Products</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalProducts}</h3>
            </div>
            <div className="p-2 rounded-md bg-primary-50 text-primary-500">
              <Package size={24} />
            </div>
          </div>
        </button>
        
        <button
          onClick={() => handleStatsClick('in-transit')}
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm">In Transit</p>
              <h3 className="text-2xl font-bold mt-1">{stats.inTransitProducts}</h3>
            </div>
            <div className="p-2 rounded-md bg-warning-50 text-warning-500">
              <Package size={24} />
            </div>
          </div>
        </button>
        
        <button
          onClick={() => handleStatsClick('delivered')}
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm">Delivered</p>
              <h3 className="text-2xl font-bold mt-1">{stats.deliveredProducts}</h3>
            </div>
            <div className="p-2 rounded-md bg-success-50 text-success-500">
              <Package size={24} />
            </div>
          </div>
        </button>
        
        <button
          onClick={() => handleStatsClick('partners')}
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm">Supply Chain Partners</p>
              <h3 className="text-2xl font-bold mt-1">
                {stats.suppliers + stats.manufacturers + stats.distributors + stats.retailers}
              </h3>
            </div>
            <div className="p-2 rounded-md bg-accent-50 text-accent-500">
              <Package size={24} />
            </div>
          </div>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SupplyChainVisualization />
        <RecentActivity />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">RFID Tracking</h3>
            <a
              href="/rfid"
              className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
            >
              View all <ArrowRight size={16} className="ml-1" />
            </a>
          </div>
          
          <div className="flex flex-col items-center justify-center py-6 border border-dashed border-neutral-300 rounded-lg">
            <div className="w-16 h-16 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full mb-3">
              <Package size={32} />
            </div>
            <p className="text-lg font-medium text-neutral-800 mb-2">RFID Management</p>
            <p className="text-neutral-500 text-center max-w-xs mb-4">
              Track and manage RFID tags across your supply chain
            </p>
            <a href="/rfid" className="btn-primary text-sm">
              Manage RFID Tags
            </a>
          </div>
        </div>
        
        <RecentTransactions />
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Product</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({
                    ...newProduct,
                    name: e.target.value
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  RFID Tag
                </label>
                <input
                  type="text"
                  required
                  className="input font-mono"
                  placeholder="0xABCD1234..."
                  value={newProduct.rfidTag}
                  onChange={(e) => setNewProduct({
                    ...newProduct,
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
                  value={newProduct.manufacturer}
                  onChange={(e) => {
                    const manufacturer = participants.find(p => p.name === e.target.value);
                    setNewProduct({
                      ...newProduct,
                      manufacturer: e.target.value,
                      currentLocation: manufacturer ? {
                        name: manufacturer.name,
                        latitude: manufacturer.location.latitude,
                        longitude: manufacturer.location.longitude
                      } : newProduct.currentLocation
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
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    className="input"
                    value={newProduct.temperature}
                    onChange={(e) => setNewProduct({
                      ...newProduct,
                      temperature: parseFloat(e.target.value)
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Humidity (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    className="input"
                    value={newProduct.humidity}
                    onChange={(e) => setNewProduct({
                      ...newProduct,
                      humidity: parseFloat(e.target.value)
                    })}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List Modal */}
      {showListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {selectedType === 'products' ? 'All Products' :
                 selectedType === 'in-transit' ? 'Products In Transit' :
                 selectedType === 'delivered' ? 'Delivered Products' :
                 selectedType === 'partners' ? 'Supply Chain Partners' : 'Items'}
              </h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input w-64"
                  />
                </div>
                <button 
                  onClick={() => setShowListModal(false)}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {selectedType === 'partners' ? (
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-50 text-neutral-600 text-left">
                      <th className="px-6 py-3 font-medium text-sm rounded-tl-lg">Name</th>
                      <th className="px-6 py-3 font-medium text-sm">Role</th>
                      <th className="px-6 py-3 font-medium text-sm">Location</th>
                      <th className="px-6 py-3 font-medium text-sm rounded-tr-lg">Products</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {getFilteredItems().map((participant: any) => (
                      <tr 
                        key={participant.id}
                        className="hover:bg-neutral-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-md ${
                              participant.role === 'manufacturer' ? 'bg-primary-50 text-primary-600' :
                              participant.role === 'supplier' ? 'bg-accent-50 text-accent-600' :
                              participant.role === 'distributor' ? 'bg-warning-50 text-warning-600' :
                              'bg-success-50 text-success-600'
                            }`}>
                              <Package size={18} />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{participant.name}</p>
                              <p className="text-xs text-neutral-500">ID: {participant.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`badge ${
                            participant.role === 'manufacturer' ? 'bg-primary-100 text-primary-800' :
                            participant.role === 'supplier' ? 'bg-accent-100 text-accent-800' :
                            participant.role === 'distributor' ? 'bg-warning-100 text-warning-800' :
                            'bg-success-100 text-success-800'
                          }`}>
                            {participant.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm">{participant.location.address}</p>
                          <p className="text-xs text-neutral-500 mt-1">
                            {participant.location.latitude.toFixed(4)}, {participant.location.longitude.toFixed(4)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-md text-sm">
                              {participant.products.length}
                            </span>
                            <a 
                              href={`/inventory?participant=${participant.id}`}
                              className="text-primary-600 hover:text-primary-800 text-sm"
                            >
                              View
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-50 text-neutral-600 text-left">
                      <th className="px-6 py-3 font-medium text-sm rounded-tl-lg">Product Name</th>
                      <th className="px-6 py-3 font-medium text-sm">Manufacturer</th>
                      <th className="px-6 py-3 font-medium text-sm">RFID Tag</th>
                      <th className="px-6 py-3 font-medium text-sm">Current Location</th>
                      <th className="px-6 py-3 font-medium text-sm">Status</th>
                      <th className="px-6 py-3 font-medium text-sm rounded-tr-lg">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {getFilteredItems().map((product: any) => (
                      <tr 
                        key={product.id}
                        className="hover:bg-neutral-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-md bg-primary-50 text-primary-600">
                              <Package size={18} />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{product.name}</p>
                              <p className="text-xs text-neutral-500">ID: {product.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">{product.manufacturer}</td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-mono">{product.rfidTag}</p>
                        </td>
                        <td className="px-6 py-4 text-sm">{product.currentLocation.name}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={product.status} />
                        </td>
                        <td className="px-6 py-4 text-sm">{formatDate(product.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;