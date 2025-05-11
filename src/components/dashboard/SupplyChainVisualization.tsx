import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSupplyChain } from '../../contexts/SupplyChainContext';

const SupplyChainVisualization: React.FC = () => {
  const { stats } = useSupplyChain();
  
  const data = [
    { name: 'Suppliers', count: stats.suppliers, color: '#3366FF' },
    { name: 'Manufacturers', count: stats.manufacturers, color: '#00CCFF' },
    { name: 'Distributors', count: stats.distributors, color: '#FFAB00' },
    { name: 'Retailers', count: stats.retailers, color: '#36B37E' },
  ];
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-neutral-200 shadow-md rounded text-xs">
          <p className="font-medium">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="card p-8">
      <h3 className="text-lg font-semibold mb-8 text-center">Supply Chain Participants</h3>
      <div className="flex justify-center items-center h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }} 
              stroke="#64748B"
              tickLine={false}
            />
            <YAxis 
              allowDecimals={false}
              tick={{ fontSize: 12 }} 
              stroke="#64748B" 
              axisLine={false} 
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              radius={[4, 4, 0, 0]} 
              barSize={40}
              fill="#3366FF"
              animationDuration={1000}
              label={{ 
                position: 'top', 
                fill: '#64748B', 
                fontSize: 12 
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SupplyChainVisualization;