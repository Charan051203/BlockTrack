import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Wallet, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBlockchain } from '../../contexts/BlockchainContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isConnected, account, connectWallet, disconnectWallet } = useBlockchain();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    logout();
    if (isConnected) {
      disconnectWallet();
    }
  };

  const handleWalletConnection = async () => {
    if (isConnected) {
      disconnectWallet();
      setError(null);
      return;
    }

    if (isConnecting) return;
    
    setIsConnecting(true);
    setError(null);

    try {
      await connectWallet();
    } catch (error: any) {
      setError(error.message || 'Failed to connect wallet. Please try again.');
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            className="md:hidden p-2 rounded-md hover:bg-neutral-100 transition-colors"
            onClick={toggleSidebar}
          >
            <Menu size={24} className="text-neutral-600" />
          </button>
          
          <Link to="/" className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-500 text-white rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <rect width="18" height="12" x="3" y="8" rx="2" />
                <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
                <path d="M12 12v4" />
                <path d="M8 12v4" />
                <path d="M16 12v4" />
              </svg>
            </div>
            <span className="ml-2 text-xl font-bold text-primary-600">BlockTrack</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleWalletConnection} 
            disabled={isConnecting}
            className={`hidden md:flex items-center space-x-2 px-3 py-1.5 border rounded-md transition-colors ${
              isConnected 
                ? 'border-success-500 bg-success-50 text-success-700 hover:bg-success-100' 
                : 'border-neutral-300 hover:bg-neutral-50'
            } ${error ? 'border-red-300' : ''}`}
          >
            <Wallet size={16} className={isConnected ? "text-success-500" : "text-neutral-600"} />
            <span className="text-sm font-medium">
              {isConnecting 
                ? 'Connecting...'
                : isConnected 
                  ? `Disconnect Wallet` 
                  : 'Connect Wallet'}
            </span>
          </button>
          {error && (
            <p className="text-xs text-red-500 mt-1">{error}</p>
          )}
          
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="flex items-center space-x-2"
            >
              <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-medium text-sm">
                {user?.name.charAt(0)}
                {user?.name.split(' ')[1]?.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-neutral-800">{user?.name}</p>
                <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
              </div>
            </button>
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-neutral-200">
                <div className="px-4 py-2 border-b border-neutral-100">
                  <p className="text-sm font-medium text-neutral-800">{user?.name}</p>
                  <p className="text-xs text-neutral-500">{user?.email}</p>
                </div>
                {isConnected && (
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <p className="text-xs font-mono text-neutral-500">
                      {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
                    </p>
                  </div>
                )}
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-neutral-100"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;