import React, { useState, useEffect } from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import { useBlockchain } from '../../contexts/BlockchainContext';
import { formatDate } from '../../utils/dateUtils';

interface BlockchainTransactionsProps {
  productId: string;
}

const BlockchainTransactions: React.FC<BlockchainTransactionsProps> = ({ productId }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getTransactionHistory } = useBlockchain();
  
  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      try {
        const history = await getTransactionHistory(productId);
        setTransactions(history);
      } catch (error) {
        console.error('Failed to load transaction history:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (productId) {
      loadTransactions();
    }
  }, [productId, getTransactionHistory]);
  
  if (loading) {
    return (
      <div className="card flex justify-center py-8">
        <div className="w-10 h-10 border-4 border-neutral-200 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="card animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Blockchain Transactions</h3>
      
      {transactions.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-neutral-500">No blockchain transactions found for this product.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {transactions.map((tx, index) => (
            <div 
              key={index}
              className="p-4 border border-neutral-200 rounded-lg hover:border-primary-200 hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-md bg-primary-100 text-primary-600 flex-shrink-0">
                  <FileText size={18} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Transaction</p>
                    <span className={`badge ${
                      tx.status === 'completed' 
                        ? 'bg-success-100 text-success-800' 
                        : 'bg-warning-100 text-warning-800'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                  
                  <p className="text-xs text-neutral-500 mt-1">
                    {formatDate(tx.timestamp)}
                  </p>
                  
                  <div className="mt-2 text-xs font-mono break-all">
                    <p className="text-neutral-500">Transaction Hash:</p>
                    <p className="font-medium text-neutral-700">{tx.txHash}</p>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-neutral-500">From:</p>
                      <p className="font-medium text-neutral-700 truncate">{tx.from}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500">To:</p>
                      <p className="font-medium text-neutral-700 truncate">{tx.to}</p>
                    </div>
                  </div>
                  
                  <a 
                    href={`https://etherscan.io/tx/${tx.txHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-3 text-xs text-primary-600 hover:text-primary-800"
                  >
                    View on Etherscan
                    <ExternalLink size={12} className="ml-1" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockchainTransactions;