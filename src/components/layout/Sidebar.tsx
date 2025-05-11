import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Boxes, 
  Users, 
  Wifi,
  CreditCard,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
          isActive
            ? 'bg-primary-50 text-primary-600 font-medium'
            : 'text-neutral-600 hover:bg-neutral-100'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden" 
          onClick={onClose}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-full md:h-[calc(100vh-0px)] bg-white border-r border-neutral-200 w-72 transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 md:p-5 flex flex-col h-full">
          <div className="py-2 md:hidden">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500 text-white rounded-lg flex items-center justify-center">
                <Package size={24} />
              </div>
              <div className="text-xl font-bold text-primary-600">BlockTrack</div>
            </div>
          </div>
          
          <div className="mt-8 space-y-1.5">
            <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavItem to="/tracking" icon={<Package size={20} />} label="Product Tracking" />
            <NavItem to="/inventory" icon={<Boxes size={20} />} label="Inventory" />
            <NavItem to="/participants" icon={<Users size={20} />} label="Participants" />
            <NavItem to="/rfid" icon={<Wifi size={20} />} label="RFID Management" />
            <NavItem to="/transactions" icon={<CreditCard size={20} />} label="Transactions" />
          </div>
          
          <div className="mt-auto pt-4 border-t border-neutral-200 space-y-1.5">
            <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
          </div>
          
          <div className="mt-6 pt-4 border-t border-neutral-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-medium">
                {user?.name.charAt(0)}
                {user?.name.split(' ')[1]?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-800">{user?.name}</p>
                <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;