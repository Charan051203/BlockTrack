import { ethers } from 'ethers';
import ProductRegistryABI from '../contracts/ProductRegistry.json';
import SupplyChainParticipantABI from '../contracts/SupplyChainParticipant.json';

const PRODUCT_REGISTRY_ADDRESS = import.meta.env.VITE_PRODUCT_REGISTRY_ADDRESS;
const PARTICIPANT_REGISTRY_ADDRESS = import.meta.env.VITE_PARTICIPANT_REGISTRY_ADDRESS;
const EXPECTED_CHAIN_ID = 1337;

class BlockchainService {
    private provider: ethers.BrowserProvider | null = null;
    private signer: ethers.JsonRpcSigner | null = null;
    private productContract: ethers.Contract | null = null;
    private participantContract: ethers.Contract | null = null;
    private isConnecting: boolean = false;

    constructor() {
        this.initializeProvider();
    }

    private async initializeProvider() {
        if (typeof window !== 'undefined' && window.ethereum) {
            this.provider = new ethers.BrowserProvider(window.ethereum);
        }
    }

    private async ensureCorrectNetwork() {
        if (!this.provider) {
            throw new Error('Provider not initialized');
        }

        const network = await this.provider.getNetwork();
        const chainId = Number(network.chainId);

        if (chainId !== EXPECTED_CHAIN_ID) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: `0x${EXPECTED_CHAIN_ID.toString(16)}` }],
                });
                // Re-initialize provider after network switch
                await this.initializeProvider();
            } catch (error: any) {
                if (error.code === 4902) {
                    throw new Error('Please add the local network (Chain ID: 1337) to your wallet');
                }
                throw new Error('Please switch to the local network (Chain ID: 1337) in your wallet');
            }
        }
    }

    async initialize(account: string) {
        if (!this.provider) {
            await this.initializeProvider();
            if (!this.provider) {
                throw new Error('Failed to initialize provider');
            }
        }

        try {
            await this.ensureCorrectNetwork();
            this.signer = await this.provider.getSigner(account);
            await this.initializeContracts();
        } catch (error) {
            console.error('Failed to initialize blockchain service:', error);
            throw error;
        }
    }

    private async initializeContracts() {
        if (!this.signer) {
            throw new Error('No signer available');
        }

        try {
            this.productContract = new ethers.Contract(
                PRODUCT_REGISTRY_ADDRESS,
                ProductRegistryABI.abi,
                this.signer
            );
            
            this.participantContract = new ethers.Contract(
                PARTICIPANT_REGISTRY_ADDRESS,
                SupplyChainParticipantABI.abi,
                this.signer
            );
        } catch (error) {
            console.error('Failed to initialize contracts:', error);
            throw error;
        }
    }

    async connectWallet(): Promise<string> {
        if (!this.provider) {
            throw new Error('MetaMask is not installed');
        }

        if (this.isConnecting) {
            throw new Error('Wallet connection in progress');
        }

        this.isConnecting = true;

        try {
            await this.ensureCorrectNetwork();

            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (!accounts || accounts.length === 0) {
                throw new Error('No accounts found');
            }

            const account = accounts[0];
            await this.initialize(account);
            return account;
        } catch (error: any) {
            if (error?.code === 4001) {
                throw new Error('Connection rejected. Please approve the connection request.');
            } else if (error?.code === -32002) {
                throw new Error('Connection request pending. Please check MetaMask.');
            } else if (error?.code === -32603) {
                throw new Error('MetaMask encountered an error. Please try again.');
            }
            throw error;
        } finally {
            this.isConnecting = false;
        }
    }

    async verifyProduct(productId: string): Promise<boolean> {
        if (!this.productContract) {
            throw new Error('Contract not initialized');
        }

        try {
            const product = await this.productContract.getProduct(productId);
            return product && product[0] === productId;
        } catch (error: any) {
            if (error?.message?.includes('Product not found')) {
                return false;
            }
            console.error('Error verifying product:', error);
            return false;
        }
    }

    async createTransaction(from: string, to: string, productId: string): Promise<string> {
        if (!this.productContract) {
            throw new Error('Contract not initialized');
        }

        try {
            const tx = await this.productContract.updateProduct(productId, 'in-transit', to);
            await tx.wait();
            return tx.hash;
        } catch (error) {
            console.error('Error creating transaction:', error);
            throw error;
        }
    }

    async getTransactionHistory(productId: string): Promise<any[]> {
        if (!this.productContract) {
            throw new Error('Contract not initialized');
        }

        try {
            const filter = this.productContract.filters.ProductUpdated(productId);
            const events = await this.productContract.queryFilter(filter);
            return events.map(event => ({
                txHash: event.transactionHash,
                blockNumber: event.blockNumber,
                status: event.args?.[1] || '',
                location: event.args?.[2] || ''
            }));
        } catch (error) {
            console.error('Error getting transaction history:', error);
            return [];
        }
    }

    async getBalance(address: string): Promise<string> {
        if (!this.provider) {
            throw new Error('Provider not initialized');
        }

        try {
            const balance = await this.provider.getBalance(address);
            return ethers.formatEther(balance);
        } catch (error) {
            console.error('Error getting balance:', error);
            throw error;
        }
    }

    async registerProduct(
        id: string,
        name: string,
        rfidTag: string,
        manufacturer: string
    ): Promise<void> {
        if (!this.productContract) {
            throw new Error('Contract not initialized');
        }

        try {
            const tx = await this.productContract.registerProduct(
                id,
                name,
                rfidTag,
                manufacturer
            );
            await tx.wait();
        } catch (error) {
            console.error('Failed to register product:', error);
            throw error;
        }
    }

    async updateProduct(
        id: string,
        status: string,
        location: string
    ): Promise<void> {
        if (!this.productContract) {
            throw new Error('Contract not initialized');
        }

        try {
            const tx = await this.productContract.updateProduct(
                id,
                status,
                location
            );
            await tx.wait();
        } catch (error) {
            console.error('Failed to update product:', error);
            throw error;
        }
    }

    async getProduct(id: string): Promise<any> {
        if (!this.productContract) {
            throw new Error('Contract not initialized');
        }

        try {
            const product = await this.productContract.getProduct(id);
            return this.formatProduct(product);
        } catch (error: any) {
            if (error?.message?.includes('Product not found')) {
                return null;
            }
            console.error('Failed to get product:', error);
            throw error;
        }
    }

    private formatProduct(product: any): any {
        return {
            id: product[0],
            name: product[1],
            rfidTag: product[2],
            manufacturer: product[3],
            manufacturerAddress: product[4],
            currentLocation: product[5],
            status: product[6],
            timestamp: Number(product[7]) * 1000,
            temperature: Number(product[8]),
            humidity: Number(product[9])
        };
    }

    async registerParticipant(
        id: string,
        name: string,
        role: string
    ): Promise<void> {
        if (!this.participantContract) {
            throw new Error('Contract not initialized');
        }

        try {
            const tx = await this.participantContract.registerParticipant(
                id,
                name,
                role
            );
            await tx.wait();
        } catch (error) {
            console.error('Failed to register participant:', error);
            throw error;
        }
    }

    async getParticipant(address: string): Promise<any> {
        if (!this.participantContract) {
            throw new Error('Contract not initialized');
        }

        try {
            const participant = await this.participantContract.getParticipant(address);
            return this.formatParticipant(participant);
        } catch (error) {
            console.error('Failed to get participant:', error);
            throw error;
        }
    }

    private formatParticipant(participant: any): any {
        return {
            id: participant[0],
            name: participant[1],
            role: participant[2],
            walletAddress: participant[3],
            isActive: participant[4],
            registeredAt: Number(participant[5]) * 1000
        };
    }
}

export const blockchainService = new BlockchainService();