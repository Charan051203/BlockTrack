import React, { useState, useEffect } from 'react';
import { User, Shield, Wifi, CreditCard, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBlockchain } from '../contexts/BlockchainContext';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const { account } = useBlockchain();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    role: user?.role || ''
  });
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        company: user.company,
        role: user.role
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveChanges = async () => {
    try {
      await updateUserProfile(formData);
      // Show success message
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Show error message
    }
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Account Settings</h2>
            
            <div className="card p-6">
              <h3 className="text-lg font-medium mb-4">Personal Information</h3>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="input"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="input"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    className="input"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Role
                  </label>
                  <select 
                    name="role"
                    className="select" 
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="admin">Admin</option>
                    <option value="manufacturer">Manufacturer</option>
                    <option value="supplier">Supplier</option>
                    <option value="distributor">Distributor</option>
                    <option value="retailer">Retailer</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <button 
                  className="btn-primary"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-medium mb-4">Change Password</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="input"
                    placeholder="••••••••"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="input"
                    placeholder="••••••••"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="input"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <button className="btn-primary">Update Password</button>
              </div>
            </div>
          </div>
        );
        
      case 'security':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Security Settings</h2>
            
            <div className="card p-6">
              <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
              
              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-md">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-neutral-500 mt-1">
                    Add an extra layer of security to your account
                  </p>
                </div>
                
                <div className="flex items-center">
                  <span className="mr-3 text-sm text-error-600">Not Enabled</span>
                  <button className="btn-primary">Enable</button>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-medium mb-4">Session Management</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-md">
                  <div>
                    <p className="font-medium">Current Session</p>
                    <p className="text-sm text-neutral-500 mt-1">
                      Browser: Chrome on Windows • IP: 192.168.1.1
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Started: 2 hours ago
                    </p>
                  </div>
                  
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                      Active
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-md">
                  <div>
                    <p className="font-medium">Previous Session</p>
                    <p className="text-sm text-neutral-500 mt-1">
                      Browser: Safari on macOS • IP: 192.168.1.1
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Last active: 2 days ago
                    </p>
                  </div>
                  
                  <div>
                    <button className="text-sm text-error-600 hover:text-error-800">
                      Revoke
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="btn bg-error-50 text-error-700 hover:bg-error-100">
                  Log Out All Other Sessions
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'rfid':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">RFID Settings</h2>
            
            <div className="card p-6">
              <h3 className="text-lg font-medium mb-4">RFID Reader Configuration</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Reader Type
                  </label>
                  <select className="select">
                    <option>UHF RFID Reader</option>
                    <option>NFC RFID Reader</option>
                    <option>HF RFID Reader</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Reader Connection
                  </label>
                  <select className="select">
                    <option>USB</option>
                    <option>Bluetooth</option>
                    <option>WiFi</option>
                    <option>Serial</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Scan Frequency (seconds)
                  </label>
                  <input
                    type="number"
                    className="input"
                    defaultValue="5"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <button className="btn-primary">Save Configuration</button>
              </div>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-medium mb-4">RFID Tag Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Temperature Tracking</p>
                    <p className="text-sm text-neutral-500 mt-1">
                      Track temperature data from RFID sensors
                    </p>
                  </div>
                  
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="temperature"
                      name="temperature"
                      className="sr-only"
                      defaultChecked
                    />
                    <label
                      htmlFor="temperature"
                      className="block h-6 overflow-hidden bg-neutral-200 rounded-full cursor-pointer"
                    >
                      <span className="block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out"></span>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Humidity Tracking</p>
                    <p className="text-sm text-neutral-500 mt-1">
                      Track humidity data from RFID sensors
                    </p>
                  </div>
                  
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="humidity"
                      name="humidity"
                      className="sr-only"
                      defaultChecked
                    />
                    <label
                      htmlFor="humidity"
                      className="block h-6 overflow-hidden bg-neutral-200 rounded-full cursor-pointer"
                    >
                      <span className="block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out"></span>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Location Tracking</p>
                    <p className="text-sm text-neutral-500 mt-1">
                      Track GPS location data from RFID sensors
                    </p>
                  </div>
                  
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="location"
                      name="location"
                      className="sr-only"
                      defaultChecked
                    />
                    <label
                      htmlFor="location"
                      className="block h-6 overflow-hidden bg-neutral-200 rounded-full cursor-pointer"
                    >
                      <span className="block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out"></span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="btn-primary">Save Settings</button>
              </div>
            </div>
          </div>
        );
        
      case 'payments':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Payment Settings</h2>
            
            <div className="card p-6">
              <h3 className="text-lg font-medium mb-4">Blockchain Wallet</h3>
              
              <div className="p-4 border border-neutral-200 rounded-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">Connected Wallet</p>
                    <p className="text-sm font-mono mt-1">
                      {account || 'No wallet connected'}
                    </p>
                  </div>
                  
                  {account && (
                    <button className="text-sm text-primary-600 hover:text-primary-800">
                      Disconnect
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-neutral-500 mt-1">Manage your account and application settings</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="card p-4 md:p-6">
            <nav className="space-y-1">
              <button
                className={`flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'account'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
                onClick={() => setActiveTab('account')}
              >
                <User size={18} />
                <span>Account</span>
              </button>
              
              <button
                className={`flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'security'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
                onClick={() => setActiveTab('security')}
              >
                <Shield size={18} />
                <span>Security</span>
              </button>
              
              <button
                className={`flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'rfid'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
                onClick={() => setActiveTab('rfid')}
              >
                <Wifi size={18} />
                <span>RFID Configuration</span>
              </button>
              
              <button
                className={`flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'payments'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
                onClick={() => setActiveTab('payments')}
              >
                <CreditCard size={18} />
                <span>Payments</span>
              </button>
              
              <div className="pt-4 mt-4 border-t border-neutral-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium rounded-md text-error-600 hover:bg-error-50"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
        
        <div className="md:col-span-3">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;