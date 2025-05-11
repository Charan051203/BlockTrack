import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useBlockchain } from './BlockchainContext';
import { useSupplyChain } from './SupplyChainContext';
import { blockchainService } from '../utils/blockchain';

interface Payment {
  id: string;
  from: string;
  to: string;
  amount: string;
  productId: string;
  timestamp: number;
  completed: boolean;
}

interface PaymentContextType {
  createPayment: (to: string, amount: string, productId: string) => Promise<void>;
  completePayment: (paymentId: string) => Promise<void>;
  getBalance: () => Promise<string>;
  payments: Payment[];
  loading: boolean;
  error: string | null;
  getRecentTransactions: (limit?: number) => Payment[];
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// Generate a secure random transaction ID
const generateTransactionId = (): string => {
  // Create a random string using current timestamp and a random number
  const randomData = Date.now().toString() + Math.random().toString();
  // Use ethers.js to create a keccak256 hash
  return ethers.id(randomData);
};

// Demo transactions for initial state when no saved data exists
const demoTransactions: Payment[] = [
  {
    id: '0x' + '1'.repeat(64), // Example hash
    from: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    amount: '0.5',
    productId: 'prod-001',
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    completed: true
  },
  {
    id: '0x' + '2'.repeat(64), // Example hash
    from: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
    to: '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
    amount: '0.75',
    productId: 'prod-002',
    timestamp: Date.now() - 12 * 60 * 60 * 1000,
    completed: true
  },
  {
    id: '0x' + '3'.repeat(64), // Example hash
    from: '0x15d34aaf54267db7d7c367839aaf71a00a2c6a65',
    to: '0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc',
    amount: '1.2',
    productId: 'prod-003',
    timestamp: Date.now() - 6 * 60 * 60 * 1000,
    completed: false
  }
];

// Load payments from localStorage
const loadPayments = (): Payment[] => {
  try {
    const saved = localStorage.getItem('blocktrack_transactions');
    return saved ? JSON.parse(saved) : demoTransactions;
  } catch (error) {
    console.error('Failed to load transactions from localStorage:', error);
    return demoTransactions;
  }
};

// Save payments to localStorage
const savePayments = (payments: Payment[]) => {
  try {
    localStorage.setItem('blocktrack_transactions', JSON.stringify(payments));
  } catch (error) {
    console.error('Failed to save transactions to localStorage:', error);
  }
};

export function PaymentProvider({ children }: { children: ReactNode }) {
  const { account, isConnected } = useBlockchain();
  const { participants } = useSupplyChain();
  const [payments, setPayments] = useState<Payment[]>(loadPayments());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial payments from localStorage
  useEffect(() => {
    setPayments(loadPayments());
  }, []);

  // Save payments whenever they change
  useEffect(() => {
    savePayments(payments);
  }, [payments]);

  const createPayment = async (to: string, amount: string, productId: string) => {
    if (!account) throw new Error('Please connect your wallet');
    if (!isConnected) throw new Error('Wallet not connected');
    
    setLoading(true);
    setError(null);
    
    try {
      // Find recipient using participant ID
      const recipient = participants.find(p => p.id === to);
      if (!recipient) {
        throw new Error('Recipient not found');
      }

      if (!recipient.walletAddress) {
        throw new Error('Recipient wallet address not found');
      }

      // Get sender's balance
      const balance = await blockchainService.getBalance(account);
      if (parseFloat(balance) < parseFloat(amount)) {
        throw new Error('Insufficient balance');
      }

      const paymentId = generateTransactionId();
      const newPayment: Payment = {
        id: paymentId,
        from: account,
        to: recipient.walletAddress,
        amount,
        productId,
        timestamp: Date.now(),
        completed: true
      };

      setPayments(prev => {
        const updated = [newPayment, ...prev];
        savePayments(updated);
        return updated;
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create payment';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const completePayment = async (paymentId: string) => {
    if (!account) throw new Error('Please connect your wallet');
    setLoading(true);
    setError(null);
    
    try {
      const payment = payments.find(p => p.id === paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      // Get sender's balance
      const balance = await blockchainService.getBalance(payment.from);
      if (parseFloat(balance) < parseFloat(payment.amount)) {
        throw new Error('Insufficient balance');
      }

      setPayments(prev => {
        const updated = prev.map(p => 
          p.id === paymentId 
            ? { ...p, completed: true }
            : p
        );
        savePayments(updated);
        return updated;
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete payment';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getBalance = async () => {
    if (!isConnected || !account) return '0.0';
    try {
      return await blockchainService.getBalance(account);
    } catch (error) {
      setError('Failed to get balance');
      throw error;
    }
  };

  const getRecentTransactions = (limit: number = 5) => {
    return payments
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  };

  return (
    <PaymentContext.Provider value={{
      createPayment,
      completePayment,
      getBalance,
      payments,
      loading,
      error,
      getRecentTransactions
    }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}