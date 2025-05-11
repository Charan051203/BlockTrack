import React, { useState } from 'react';
import { usePayment } from '../contexts/PaymentContext';
import { useBlockchain } from '../contexts/BlockchainContext';
import { useSupplyChain } from '../contexts/SupplyChainContext';
import { format } from 'date-fns';
import { CreditCard, ArrowRight, Search, Filter, ArrowDown, ArrowUp, X, Wallet } from 'lucide-react';

const Transactions: React.FC = () => {
  const { payments, loading, error, createPayment, getBalance } = usePayment();
  const { account } = useBlockchain();
  const { participants } = useSupplyChain();
  const [balance, setBalance] = useState('0.0');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    to: '',
    amount: '',
    productId: ''
  });

  React.useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        try {
          const bal = await getBalance();
          setBalance(bal);
        } catch (error) {
          console.error('Failed to fetch balance:', error);
        }
      }
    };

    fetchBalance();
  }, [account, getBalance]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPayment(newTransaction.to, newTransaction.amount, newTransaction.productId);
      setShowNewTransactionModal(false);
      setNewTransaction({ to: '', amount: '', productId: '' });
      // Refresh balance after transaction
      const newBalance = await getBalance();
      setBalance(newBalance);
    } catch (error) {
      console.error('Failed to create transaction:', error);
    }
  };

  const filteredTransactions = payments.filter(payment => {
    if (filterStatus !== 'all' && payment.completed !== (filterStatus === 'completed')) {
      return false;
    }
    
    if (searchTerm === '') return true;
    
    return (
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.to.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'amount':
        return direction * (parseFloat(a.amount) - parseFloat(b.amount));
      case 'timestamp':
        return direction * (a.timestamp - b.timestamp);
      default:
        return direction * a[sortField].localeCompare(b[sortField]);
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-neutral-200 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-neutral-500 mt-1">View and manage blockchain transactions</p>
        </div>
        
        <button 
          className="btn-primary flex items-center space-x-2"
          onClick={() => setShowNewTransactionModal(true)}
        >
          <CreditCard size={18} />
          <span>New Transaction</span>
        </button>
      </div>

      {/* Wallet Balance Card */}
      <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Wallet Balance</h3>
          <div className="p-2 rounded-md bg-white/10">
            <Wallet size={24} />
          </div>
        </div>
        <div className="text-3xl font-bold">{balance} ETH</div>
        <p className="text-sm text-white/80 mt-2">
          Connected Account: {account ? `${account.substring(0, 6)}...${account.substring(38)}` : 'Not Connected'}
        </p>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-2 w-full border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-neutral-500" />
              <select
                className="select py-2 border border-neutral-300"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 text-neutral-600 text-left">
                <th className="px-6 py-3 font-medium text-sm rounded-tl-lg cursor-pointer" onClick={() => handleSort('id')}>
                  <div className="flex items-center space-x-1">
                    <span>Transaction ID</span>
                    {sortField === 'id' && (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 font-medium text-sm">From</th>
                <th className="px-6 py-3 font-medium text-sm">To</th>
                <th className="px-6 py-3 font-medium text-sm cursor-pointer" onClick={() => handleSort('amount')}>
                  <div className="flex items-center space-x-1">
                    <span>Amount</span>
                    {sortField === 'amount' && (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 font-medium text-sm">Status</th>
                <th className="px-6 py-3 font-medium text-sm cursor-pointer rounded-tr-lg" onClick={() => handleSort('timestamp')}>
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    {sortField === 'timestamp' && (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-neutral-200">
              {sortedTransactions.map((transaction) => (
                <tr 
                  key={transaction.id}
                  className="hover:bg-neutral-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-md bg-primary-50 text-primary-600">
                        <CreditCard size={18} />
                      </div>
                      <div>
                        <p className="font-mono text-sm">{transaction.id.substring(0, 8)}...</p>
                        <p className="text-xs text-neutral-500">Product: {transaction.productId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-mono text-sm">
                      {transaction.from.substring(0, 6)}...{transaction.from.substring(38)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-mono text-sm">
                      {transaction.to.substring(0, 6)}...{transaction.to.substring(38)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{transaction.amount} ETH</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${
                      transaction.completed
                        ? 'bg-success-100 text-success-800'
                        : 'bg-warning-100 text-warning-800'
                    }`}>
                      {transaction.completed ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {format(transaction.timestamp, 'MMM d, yyyy HH:mm')}
                  </td>
                </tr>
              ))}
              
              {sortedTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-error-50 text-error-800 rounded-md">
            {error}
          </div>
        )}
      </div>

      {/* New Transaction Modal */}
      {showNewTransactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">New Transaction</h2>
              <button 
                onClick={() => setShowNewTransactionModal(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Recipient (Participant)
                </label>
                <select
                  className="select"
                  required
                  value={newTransaction.to}
                  onChange={(e) => setNewTransaction({
                    ...newTransaction,
                    to: e.target.value
                  })}
                >
                  <option value="">Select Recipient</option>
                  {participants.map(participant => (
                    <option key={participant.id} value={participant.id}>
                      {participant.name} ({participant.role})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Amount (ETH)
                </label>
                <input
                  type="number"
                  step="0.001"
                  required
                  className="input"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({
                    ...newTransaction,
                    amount: e.target.value
                  })}
                  placeholder="0.000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Product ID
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={newTransaction.productId}
                  onChange={(e) => setNewTransaction({
                    ...newTransaction,
                    productId: e.target.value
                  })}
                  placeholder="Enter product ID"
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewTransactionModal(false)}
                  className="btn bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Create Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;