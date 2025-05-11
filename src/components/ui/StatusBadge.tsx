import React from 'react';

interface StatusBadgeProps {
  status: 'manufactured' | 'shipped' | 'in-transit' | 'delivered' | 'sold' | string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'manufactured':
        return 'bg-primary-100 text-primary-800';
      case 'shipped':
        return 'bg-warning-100 text-warning-800';
      case 'in-transit':
        return 'bg-accent-100 text-accent-800';
      case 'delivered':
        return 'bg-success-100 text-success-800';
      case 'sold':
        return 'bg-neutral-100 text-neutral-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <span className={`badge ${getStatusStyles()} ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;