import React, { ReactNode } from 'react';

interface DataCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  className?: string;
}

const DataCard: React.FC<DataCardProps> = ({ 
  title, 
  value, 
  icon,
  trend,
  className = '' 
}) => {
  return (
    <div className={`card ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-neutral-500 text-sm">{title}</p>
          <div className="mt-2">
            <span className="text-2xl font-bold block">{value}</span>
          </div>
          
          {trend && (
            <div className="flex items-center mt-2">
              <div 
                className={`flex items-center text-xs font-medium ${
                  trend.isPositive ? 'text-success-600' : 'text-error-600'
                }`}
              >
                <svg
                  className={`w-3 h-3 mr-1 ${!trend.isPositive && 'transform rotate-180'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  ></path>
                </svg>
                {trend.value}%
              </div>
              <span className="text-xs text-neutral-500 ml-1.5">{trend.label}</span>
            </div>
          )}
        </div>
        
        <div className="p-2 rounded-md bg-primary-50 text-primary-500 flex-shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DataCard;