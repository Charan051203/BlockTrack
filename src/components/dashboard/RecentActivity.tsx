import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useSupplyChain } from '../../contexts/SupplyChainContext';
import { formatDate } from '../../utils/dateUtils';

const RecentActivity: React.FC = () => {
  const { products, participants } = useSupplyChain();
  
  // Sort products by timestamp (most recent first)
  const recentProducts = [...products]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);
  
  // Function to get participant name by location name
  const getParticipantByName = (name: string) => {
    return participants.find(p => p.name === name);
  };
  
  // Generate activity description
  const getActivityDescription = (product: any) => {
    const participant = getParticipantByName(product.currentLocation.name);
    
    switch (product.status) {
      case 'manufactured':
        return `${product.name} was manufactured by ${product.manufacturer}`;
      case 'shipped':
        return `${product.name} was shipped from ${product.manufacturer}`;
      case 'in-transit':
        return `${product.name} is in transit with ${product.currentLocation.name}`;
      case 'delivered':
        return `${product.name} was delivered to ${product.currentLocation.name}`;
      case 'sold':
        return `${product.name} was sold to customer at ${product.currentLocation.name}`;
      default:
        return `${product.name} status updated to ${product.status}`;
    }
  };
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
      </div>
      
      <div className="space-y-4">
        {recentProducts.map((product) => (
          <div key={product.id} className="flex items-start space-x-3 p-3 rounded-md hover:bg-neutral-50">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
              {product.name.charAt(0)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">
                {getActivityDescription(product)}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-neutral-500">
                  {formatDate(product.timestamp)}
                </span>
                <span className="mx-1 text-neutral-300">•</span>
                <span className="text-xs text-neutral-500">
                  RFID: {product.rfidTag.substring(0, 10)}...
                </span>
              </div>
            </div>
            
            <a href={`/tracking?id=${product.id}`} className="inline-flex items-center p-1.5 text-sm font-medium text-primary-600 hover:text-primary-800">
              <span className="sr-only">View details</span>
              <ArrowRight size={16} />
            </a>
          </div>
        ))}
        
        {recentProducts.length === 0 && (
          <div className="text-center py-6">
            <p className="text-neutral-500">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;