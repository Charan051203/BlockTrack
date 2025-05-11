import React from 'react';
import { ArrowRight, CreditCard } from 'lucide-react';
import { usePayment } from '../../contexts/PaymentContext';
import { formatDate } from '../../utils/dateUtils';
import { Link } from 'react-router-dom';

const RecentTransactions: React.FC = () => {
  const { getRecentTransactions } = usePayment();
  const transactions = getRecentTransactions(3);
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <Link
          to="/transactions"
          className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
        >
          View all <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
      
      <div className="space-y-4">
        {transactions.map((tx, index) => (
          <div
            key={tx.id}
            className="p-4 border border-neutral-200 rounded-lg hover:border-primary-200 hover:bg-primary-50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-md bg-primary-100 text-primary-600">
                  <CreditCard size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">Transaction</p>
                  <p className="text-xs text-neutral-500">
                    Product ID: {tx.productId}
                  </p>
                </div>
              </div>
              <span className={`badge ${
                tx.completed 
                  ? 'bg-success-100 text-success-800' 
                  : 'bg-warning-100 text-warning-800'
              }`}>
                {tx.completed ? 'Completed' : 'Pending'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div>
                <p className="text-xs text-neutral-500">Amount:</p>
                <p className="text-sm font-medium">{tx.amount} ETH</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Date:</p>
                <p className="text-sm">{formatDate(tx.timestamp)}</p>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-neutral-200 flex justify-between items-center">
              <div className="grid grid-cols-2 gap-4 text-xs text-neutral-500">
                <div>
                  <p>From:</p>
                  <p className="font-mono">{tx.from.substring(0, 6)}...{tx.from.substring(38)}</p>
                </div>
                <div>
                  <p>To:</p>
                  <p className="font-mono">{tx.to.substring(0, 6)}...{tx.to.substring(38)}</p>
                </div>
              </div>
              <Link
                to={`/transactions?tx=${tx.id}`}
                className="text-xs text-primary-600 hover:text-primary-800"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
        
        {transactions.length === 0 && (
          <div className="text-center py-6">
            <p className="text-neutral-500">No recent transactions</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;