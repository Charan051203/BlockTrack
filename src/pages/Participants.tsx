import React, { useState } from 'react';
import { Users, Building, TruckIcon, ShoppingBag, Package, Search, Filter, ArrowDown, ArrowUp, PlusCircle, X } from 'lucide-react';
import { useSupplyChain } from '../contexts/SupplyChainContext';

const Participants: React.FC = () => {
  const { participants, addParticipant } = useSupplyChain();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newParticipant, setNewParticipant] = useState({
    name: '',
    role: 'manufacturer' as const,
    location: {
      address: '',
      latitude: 0,
      longitude: 0
    }
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addParticipant(newParticipant);
      setShowAddModal(false);
      setNewParticipant({
        name: '',
        role: 'manufacturer',
        location: {
          address: '',
          latitude: 0,
          longitude: 0
        }
      });
    } catch (error) {
      console.error('Failed to add participant:', error);
    }
  };

  const handleRoleFilter = (role: string) => {
    setFilterRole(role === filterRole ? 'all' : role);
  };

  const filteredParticipants = participants.filter(participant => {
    if (filterRole !== 'all' && participant.role !== filterRole) return false;
    
    if (searchTerm === '') return true;
    
    return (
      participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.location.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedParticipants = [...filteredParticipants].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortField === 'role') {
      return sortDirection === 'asc'
        ? a.role.localeCompare(b.role)
        : b.role.localeCompare(a.role);
    } else if (sortField === 'products') {
      return sortDirection === 'asc'
        ? a.products.length - b.products.length
        : b.products.length - a.products.length;
    } else {
      return sortDirection === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'manufacturer':
        return <Building size={18} className="text-primary-600" />;
      case 'supplier':
        return <Package size={18} className="text-accent-600" />;
      case 'distributor':
        return <TruckIcon size={18} className="text-warning-600" />;
      case 'retailer':
        return <ShoppingBag size={18} className="text-success-600" />;
      default:
        return <Users size={18} className="text-neutral-600" />;
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'manufacturer':
        return 'bg-primary-100 text-primary-800';
      case 'supplier':
        return 'bg-accent-100 text-accent-800';
      case 'distributor':
        return 'bg-warning-100 text-warning-800';
      case 'retailer':
        return 'bg-success-100 text-success-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const stats = {
    manufacturers: participants.filter(p => p.role === 'manufacturer').length,
    suppliers: participants.filter(p => p.role === 'supplier').length,
    distributors: participants.filter(p => p.role === 'distributor').length,
    retailers: participants.filter(p => p.role === 'retailer').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Supply Chain Participants</h1>
          <p className="text-neutral-500 mt-1">Manage all partners in your supply chain network</p>
        </div>
        
        <button 
          className="btn-primary flex items-center space-x-2"
          onClick={() => setShowAddModal(true)}
        >
          <PlusCircle size={18} />
          <span>Add Participant</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => handleRoleFilter('manufacturer')}
          className={`card p-4 flex flex-col items-center justify-center transition-colors ${
            filterRole === 'manufacturer' ? 'ring-2 ring-primary-500 bg-primary-50' : ''
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mb-3">
            <Building size={24} />
          </div>
          <span className="text-2xl font-bold">{stats.manufacturers}</span>
          <span className="text-neutral-500 text-sm">Manufacturers</span>
        </button>
        
        <button
          onClick={() => handleRoleFilter('supplier')}
          className={`card p-4 flex flex-col items-center justify-center transition-colors ${
            filterRole === 'supplier' ? 'ring-2 ring-accent-500 bg-accent-50' : ''
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center mb-3">
            <Package size={24} />
          </div>
          <span className="text-2xl font-bold">{stats.suppliers}</span>
          <span className="text-neutral-500 text-sm">Suppliers</span>
        </button>
        
        <button
          onClick={() => handleRoleFilter('distributor')}
          className={`card p-4 flex flex-col items-center justify-center transition-colors ${
            filterRole === 'distributor' ? 'ring-2 ring-warning-500 bg-warning-50' : ''
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-warning-100 text-warning-600 flex items-center justify-center mb-3">
            <TruckIcon size={24} />
          </div>
          <span className="text-2xl font-bold">{stats.distributors}</span>
          <span className="text-neutral-500 text-sm">Distributors</span>
        </button>
        
        <button
          onClick={() => handleRoleFilter('retailer')}
          className={`card p-4 flex flex-col items-center justify-center transition-colors ${
            filterRole === 'retailer' ? 'ring-2 ring-success-500 bg-success-50' : ''
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-success-100 text-success-600 flex items-center justify-center mb-3">
            <ShoppingBag size={24} />
          </div>
          <span className="text-2xl font-bold">{stats.retailers}</span>
          <span className="text-neutral-500 text-sm">Retailers</span>
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
              placeholder="Search participants..."
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
                    <span>Name</span>
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 font-medium text-sm cursor-pointer" onClick={() => handleSort('role')}>
                  <div className="flex items-center space-x-1">
                    <span>Role</span>
                    {sortField === 'role' && (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 font-medium text-sm">Location</th>
                <th className="px-6 py-3 font-medium text-sm cursor-pointer rounded-tr-lg" onClick={() => handleSort('products')}>
                  <div className="flex items-center space-x-1">
                    <span>Products</span>
                    {sortField === 'products' && (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-neutral-200">
              {sortedParticipants.map((participant) => (
                <tr 
                  key={participant.id}
                  className="hover:bg-neutral-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-md ${
                        participant.role === 'manufacturer' ? 'bg-primary-50' :
                        participant.role === 'supplier' ? 'bg-accent-50' :
                        participant.role === 'distributor' ? 'bg-warning-50' :
                        'bg-success-50'
                      }`}>
                        {getRoleIcon(participant.role)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{participant.name}</p>
                        <p className="text-xs text-neutral-500">ID: {participant.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${getRoleBadgeStyle(participant.role)}`}>
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
              
              {sortedParticipants.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                    No participants match your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Participant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Participant</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddParticipant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={newParticipant.name}
                  onChange={(e) => setNewParticipant({
                    ...newParticipant,
                    name: e.target.value
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Role
                </label>
                <select
                  className="select"
                  value={newParticipant.role}
                  onChange={(e) => setNewParticipant({
                    ...newParticipant,
                    role: e.target.value as any
                  })}
                >
                  <option value="manufacturer">Manufacturer</option>
                  <option value="supplier">Supplier</option>
                  <option value="distributor">Distributor</option>
                  <option value="retailer">Retailer</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={newParticipant.location.address}
                  onChange={(e) => setNewParticipant({
                    ...newParticipant,
                    location: {
                      ...newParticipant.location,
                      address: e.target.value
                    }
                  })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    className="input"
                    value={newParticipant.location.latitude}
                    onChange={(e) => setNewParticipant({
                      ...newParticipant,
                      location: {
                        ...newParticipant.location,
                        latitude: parseFloat(e.target.value)
                      }
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    className="input"
                    value={newParticipant.location.longitude}
                    onChange={(e) => setNewParticipant({
                      ...newParticipant,
                      location: {
                        ...newParticipant.location,
                        longitude: parseFloat(e.target.value)
                      }
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
                  Add Participant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Participants;