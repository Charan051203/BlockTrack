import React, { useState } from 'react';
import { Search, Package, PlusCircle, X, Box, TruckIcon, CheckCircle, ShoppingBag } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import ProductDetailsModal from '../components/ui/ProductDetailsModal';
import { useSupplyChain } from '../contexts/SupplyChainContext';
import { formatDate } from '../utils/dateUtils';

const Inventory: React.FC = () => {
  const { products, participants, addProduct } = useSupplyChain();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    rfidTag: '',
    manufacturer: '',
    currentLocation: {
      name: '',
      latitude: 0,
      longitude: 0
    },
    status: 'manufactured' as const
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
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
        status: 'manufactured'
      });
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const handleStatusFilter = (status: string) => {
    setFilterStatus(status === filterStatus ? 'all' : status);
  };

  const stats = {
    manufactured: products.filter(p => p.status === 'manufactured').length,
    inTransit: products.filter(p => p.status === 'in-transit').length,
    delivered: products.filter(p => p.status === 'delivered').length,
    sold: products.filter(p => p.status === 'sold').length,
  };

  const filteredProducts = products.filter(product => {
    if (filterStatus !== 'all' && product.status !== filterStatus) return false;
    
    if (searchTerm === '') return true;
    
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.rfidTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortField === 'manufacturer') {
      return sortDirection === 'asc'
        ? a.manufacturer.localeCompare(b.manufacturer)
        : b.manufacturer.localeCompare(a.manufacturer);
    } else if (sortField === 'status') {
      return sortDirection === 'asc'
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    } else {
      return sortDirection === 'asc'
        ? a.timestamp - b.timestamp
        : b.timestamp - a.timestamp;
    }
  });

  const manufacturers = participants
    .filter(p => p.role === 'manufacturer')
    .map(p => p.name);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-neutral-500 mt-1">Manage and track all products in your supply chain</p>
        </div>
        
        <button 
          className="btn-primary flex items-center space-x-2"
          onClick={() => setShowAddModal(true)}
        >
          <PlusCircle size={18} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => handleStatusFilter('manufactured')}
          className={`card p-4 flex flex-col items-center justify-center transition-colors ${
            filterStatus === 'manufactured' ? 'ring-2 ring-primary-500 bg-primary-50' : ''
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mb-3">
            <Box size={24} />
          </div>
          <span className="text-2xl font-bold">{stats.manufactured}</span>
          <span className="text-neutral-500 text-sm">Manufactured</span>
        </button>

        <button
          onClick={() => handleStatusFilter('in-transit')}
          className={`card p-4 flex flex-col items-center justify-center transition-colors ${
            filterStatus === 'in-transit' ? 'ring-2 ring-warning-500 bg-warning-50' : ''
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-warning-100 text-warning-600 flex items-center justify-center mb-3">
            <TruckIcon size={24} />
          </div>
          <span className="text-2xl font-bold">{stats.inTransit}</span>
          <span className="text-neutral-500 text-sm">In Transit</span>
        </button>

        <button
          onClick={() => handleStatusFilter('delivered')}
          className={`card p-4 flex flex-col items-center justify-center transition-colors ${
            filterStatus === 'delivered' ? 'ring-2 ring-success-500 bg-success-50' : ''
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-success-100 text-success-600 flex items-center justify-center mb-3">
            <CheckCircle size={24} />
          </div>
          <span className="text-2xl font-bold">{stats.delivered}</span>
          <span className="text-neutral-500 text-sm">Delivered</span>
        </button>

        <button
          onClick={() => handleStatusFilter('sold')}
          className={`card p-4 flex flex-col items-center justify-center transition-colors ${
            filterStatus === 'sold' ? 'ring-2 ring-accent-500 bg-accent-50' : ''
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center mb-3">
            <ShoppingBag size={24} />
          </div>
          <span className="text-2xl font-bold">{stats.sold}</span>
          <span className="text-neutral-500 text-sm">Sold</span>
        </button>
      </div>
      
      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search products, RFID tags..."
              className="pl-10 pr-4 py-2 w-full border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 text-neutral-600 text-left">
                <th className="px-6 py-3 font-medium text-sm rounded-tl-lg cursor-pointer" onClick={() => handleSort('name')}>
                  <div className="flex items-center space-x-1">
                    <span>Product Name</span>
                  </div>
                </th>
                <th className="px-6 py-3 font-medium text-sm cursor-pointer" onClick={() => handleSort('manufacturer')}>
                  <div className="flex items-center space-x-1">
                    <span>Manufacturer</span>
                  </div>
                </th>
                <th className="px-6 py-3 font-medium text-sm">RFID Tag</th>
                <th className="px-6 py-3 font-medium text-sm">Current Location</th>
                <th className="px-6 py-3 font-medium text-sm cursor-pointer" onClick={() => handleSort('status')}>
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                  </div>
                </th>
                <th className="px-6 py-3 font-medium text-sm cursor-pointer rounded-tr-lg" onClick={() => handleSort('timestamp')}>
                  <div className="flex items-center space-x-1">
                    <span>Last Updated</span>
                  </div>
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-neutral-200">
              {sortedProducts.map((product) => (
                <tr 
                  key={product.id}
                  className="hover:bg-neutral-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
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
              
              {sortedProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                    No products match your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default Inventory;