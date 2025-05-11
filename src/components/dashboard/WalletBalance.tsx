import React, { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useBlockchain } from '../../contexts/BlockchainContext';
import { usePayment } from '../../contexts/PaymentContext';

const WalletBalance: React.FC = () => {
  const { account, isConnected } = useBlockchain();
  const { getBalance, deposit, withdraw, loading, error } = usePayment();
  const [balance, setBalance] = useState('0.0');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const bal = await getBalance();
        setBalance(bal);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
        setBalance('0.0');
      }
    };

    fetchBalance();
  }, [account, isConnected, getBalance]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;
    
    try {
      await deposit(amount);
      setShowDepositModal(false);
      setAmount('');
      // Refresh balance
      const newBalance = await getBalance();
      setBalance(newBalance);
    } catch (error) {
      console.error('Deposit failed:', error);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;
    
    try {
      await withdraw(amount);
      setShowWithdrawModal(false);
      setAmount('');
      // Refresh balance
      const newBalance = await getBalance();
      setBalance(newBalance);
    } catch (error) {
      console.error('Withdrawal failed:', error);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Wallet Balance</h3>
        <div className={`p-2 rounded-md ${isConnected ? 'bg-primary-50 text-primary-600' : 'bg-neutral-100 text-neutral-400'}`}>
          <Wallet size={24} />
        </div>
      </div>

      <div className="text-3xl font-bold mb-4">{isConnected ? balance : '0.0'} ETH</div>

      {!isConnected ? (
        <p className="text-neutral-500 text-sm">Connect your wallet to manage funds</p>
      ) : (
        <div className="flex space-x-3">
          <button
            onClick={() => setShowDepositModal(true)}
            className="btn flex-1 bg-success-500 text-white hover:bg-success-600 flex items-center justify-center"
            disabled={loading}
          >
            <ArrowDownRight size={18} className="mr-2" />
            Deposit
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="btn flex-1 bg-warning-500 text-white hover:bg-warning-600 flex items-center justify-center"
            disabled={loading}
          >
            <ArrowUpRight size={18} className="mr-2" />
            Withdraw
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-error-50 text-error-600 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Deposit ETH</h2>
            <form onSubmit={handleDeposit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Amount (ETH)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="btn bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Withdraw ETH</h2>
            <form onSubmit={handleWithdraw}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Amount (ETH)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="btn bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Withdraw'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletBalance;