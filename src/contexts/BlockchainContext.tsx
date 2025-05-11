import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { blockchainService } from '../utils/blockchain';

interface BlockchainContextType {
  isConnected: boolean;
  account: string | null;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  verifyProduct: (productId: string) => Promise<boolean>;
  createTransaction: (from: string, to: string, productId: string) => Promise<string>;
  getTransactionHistory: (productId: string) => Promise<any[]>;
  registerProduct: (id: string, name: string, rfidTag: string, manufacturer: string) => Promise<void>;
  updateProduct: (id: string, status: string, location: string) => Promise<void>;
  getProduct: (id: string) => Promise<any>;
  registerParticipant: (id: string, name: string, role: string) => Promise<void>;
  getParticipant: (address: string) => Promise<any>;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      if (!window.ethereum) {
        console.warn('MetaMask is not installed');
        return;
      }

      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const account = accounts[0];
          try {
            await blockchainService.initialize(account);
            setAccount(account);
            setIsConnected(true);
          } catch (error: any) {
            console.warn('Failed to initialize blockchain service:', error);
            if (error.message.includes('switch to the local network')) {
              setIsConnected(false);
              setAccount(null);
            }
          }
        }
      } catch (error) {
        console.warn('Error checking wallet connection:', error);
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async (accounts: string[]) => {
        if (accounts.length > 0) {
          const account = accounts[0];
          try {
            await blockchainService.initialize(account);
            setAccount(account);
            setIsConnected(true);
          } catch (error: any) {
            console.warn('Failed to initialize after account change:', error);
            if (error.message.includes('switch to the local network')) {
              setIsConnected(false);
              setAccount(null);
            } else {
              setAccount(account);
            }
          }
        } else {
          setAccount(null);
          setIsConnected(false);
        }
      });

      window.ethereum.on('chainChanged', async () => {
        if (account) {
          try {
            await blockchainService.initialize(account);
            setIsConnected(true);
          } catch (error: any) {
            console.warn('Failed to initialize after chain change:', error);
            if (error.message.includes('switch to the local network')) {
              setIsConnected(false);
              setAccount(null);
            }
          }
        }
      });

      window.ethereum.on('disconnect', () => {
        setAccount(null);
        setIsConnected(false);
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
        window.ethereum.removeListener('disconnect', () => {});
      }
    };
  }, [account]);

  const connectWallet = async (): Promise<boolean> => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed. Please install MetaMask to connect your wallet.');
    }

    try {
      const account = await blockchainService.connectWallet();
      setAccount(account);
      setIsConnected(true);
      return true;
    } catch (error: any) {
      console.warn('Error connecting wallet:', error);
      if (error.message.includes('switch to the local network')) {
        setIsConnected(false);
        setAccount(null);
      }
      throw error;
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
  };

  return (
    <BlockchainContext.Provider
      value={{
        isConnected,
        account,
        connectWallet,
        disconnectWallet,
        verifyProduct: blockchainService.verifyProduct.bind(blockchainService),
        createTransaction: blockchainService.createTransaction.bind(blockchainService),
        getTransactionHistory: blockchainService.getTransactionHistory.bind(blockchainService),
        registerProduct: blockchainService.registerProduct.bind(blockchainService),
        updateProduct: blockchainService.updateProduct.bind(blockchainService),
        getProduct: blockchainService.getProduct.bind(blockchainService),
        registerParticipant: blockchainService.registerParticipant.bind(blockchainService),
        getParticipant: blockchainService.getParticipant.bind(blockchainService),
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = (): BlockchainContextType => {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

declare global {
  interface Window {
    ethereum?: any;
  }
}