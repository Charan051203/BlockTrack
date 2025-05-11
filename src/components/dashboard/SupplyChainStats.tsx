import React from 'react';
import { Package, TruckIcon, CheckCircle, Users } from 'lucide-react';
import DataCard from '../ui/DataCard';
import { useSupplyChain } from '../../contexts/SupplyChainContext';

const SupplyChainStats: React.FC = () => {
  const { stats } = useSupplyChain();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="w-full">
        <DataCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<Package size={24} />}
        />
      </div>
      
      <div className="w-full">
        <DataCard
          title="In Transit"
          value={stats.inTransitProducts}
          icon={<TruckIcon size={24} />}
        />
      </div>
      
      <div className="w-full">
        <DataCard
          title="Delivered"
          value={stats.deliveredProducts}
          icon={<CheckCircle size={24} />}
        />
      </div>
      
      <div className="w-full">
        <DataCard
          title="Supply Chain Partners"
          value={stats.suppliers + stats.manufacturers + stats.distributors + stats.retailers}
          icon={<Users size={24} />}
        />
      </div>
    </div>
  );
};

export default SupplyChainStats;