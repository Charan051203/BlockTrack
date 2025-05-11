import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Product {
  id: string;
  name: string;
  rfidTag: string;
  manufacturer: string;
  currentLocation: {
    name: string;
    latitude: number;
    longitude: number;
  };
  status: 'manufactured' | 'shipped' | 'in-transit' | 'delivered' | 'sold';
  timestamp: number;
  temperature?: number;
  humidity?: number;
}

interface Participant {
  id: string;
  name: string;
  role: 'manufacturer' | 'supplier' | 'distributor' | 'retailer';
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  products: string[];
  walletAddress: string;
  walletBalance: number;
}

interface SupplyChainStats {
  totalProducts: number;
  inTransitProducts: number;
  deliveredProducts: number;
  averageShippingTime: number;
  suppliers: number;
  manufacturers: number;
  distributors: number;
  retailers: number;
}

interface SupplyChainContextType {
  products: Product[];
  participants: Participant[];
  stats: SupplyChainStats;
  loading: boolean;
  getProduct: (id: string) => Product | undefined;
  getParticipant: (id: string) => Participant | undefined;
  trackProduct: (rfidTag: string) => Product | undefined;
  transferProduct: (productId: string, fromId: string, toId: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
  addParticipant: (participant: Omit<Participant, 'id' | 'products'>) => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'timestamp'>) => Promise<void>;
  updateProductStatus: (productId: string, status: Product['status']) => Promise<void>;
}

const SupplyChainContext = createContext<SupplyChainContextType | undefined>(undefined);

// Load data from localStorage
const loadData = () => {
  const savedProducts = localStorage.getItem('blocktrack_products');
  const savedParticipants = localStorage.getItem('blocktrack_participants');
  return {
    products: savedProducts ? JSON.parse(savedProducts) : demoProducts,
    participants: savedParticipants ? JSON.parse(savedParticipants) : demoParticipants
  };
};

// Save data to localStorage
const saveData = (products: Product[], participants: Participant[]) => {
  localStorage.setItem('blocktrack_products', JSON.stringify(products));
  localStorage.setItem('blocktrack_participants', JSON.stringify(participants));
};

const demoProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Smartphone Model X',
    rfidTag: '0xABCD1234EFGH5678',
    manufacturer: 'TechCorp',
    currentLocation: {
      name: 'TechCorp Manufacturing',
      latitude: 37.7749,
      longitude: -122.4194
    },
    status: 'manufactured',
    timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000
  },
  {
    id: 'prod-002',
    name: 'Laptop Pro 15',
    rfidTag: '0x1234ABCD5678EFGH',
    manufacturer: 'TechCorp',
    currentLocation: {
      name: 'Global Shipping Inc.',
      latitude: 34.0522,
      longitude: -118.2437
    },
    status: 'in-transit',
    timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000,
    temperature: 22,
    humidity: 45
  },
  {
    id: 'prod-003',
    name: 'Smart TV 55"',
    rfidTag: '0xEFGH5678ABCD1234',
    manufacturer: 'ElectroVision',
    currentLocation: {
      name: 'ElectroMart',
      latitude: 40.7128,
      longitude: -74.0060
    },
    status: 'delivered',
    timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000
  },
  {
    id: 'prod-004',
    name: 'Wireless Headphones',
    rfidTag: '0x5678EFGH1234ABCD',
    manufacturer: 'SoundWave',
    currentLocation: {
      name: 'TechRetail',
      latitude: 41.8781,
      longitude: -87.6298
    },
    status: 'sold',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000
  },
  {
    id: 'prod-005',
    name: 'Gaming Console Pro',
    rfidTag: '0x9012IJKL3456MNOP',
    manufacturer: 'GameTech',
    currentLocation: {
      name: 'GameTech Factory',
      latitude: 35.6762,
      longitude: 139.6503
    },
    status: 'manufactured',
    timestamp: Date.now() - 8 * 24 * 60 * 60 * 1000,
    temperature: 21,
    humidity: 40
  },
  {
    id: 'prod-006',
    name: 'Smart Watch Series 5',
    rfidTag: '0xQRST7890UVWX1234',
    manufacturer: 'TechCorp',
    currentLocation: {
      name: 'Asia Distribution Center',
      latitude: 1.3521,
      longitude: 103.8198
    },
    status: 'in-transit',
    timestamp: Date.now() - 6 * 24 * 60 * 60 * 1000,
    temperature: 23,
    humidity: 50
  },
  {
    id: 'prod-007',
    name: 'Tablet Pro 12.9',
    rfidTag: '0xYZAB2345CDEF6789',
    manufacturer: 'TechVision',
    currentLocation: {
      name: 'European Logistics Hub',
      latitude: 52.3676,
      longitude: 4.9041
    },
    status: 'in-transit',
    timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
    temperature: 20,
    humidity: 42
  },
  {
    id: 'prod-008',
    name: 'Smart Home Hub',
    rfidTag: '0xGHIJ3456KLMN7890',
    manufacturer: 'HomeConnect',
    currentLocation: {
      name: 'Smart Living Store',
      latitude: 48.8566,
      longitude: 2.3522
    },
    status: 'delivered',
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000
  },
  {
    id: 'prod-009',
    name: 'Professional Camera',
    rfidTag: '0xPQRS4567TUVW8901',
    manufacturer: 'OptiTech',
    currentLocation: {
      name: 'Photo Pro Store',
      latitude: 51.5074,
      longitude: -0.1278
    },
    status: 'sold',
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000
  },
  {
    id: 'prod-010',
    name: 'Electric Vehicle Model Y',
    rfidTag: '0xXYZA5678BCDE9012',
    manufacturer: 'EcoMotors',
    currentLocation: {
      name: 'EcoMotors Factory',
      latitude: 37.3382,
      longitude: -121.8863
    },
    status: 'manufactured',
    timestamp: Date.now() - 12 * 24 * 60 * 60 * 1000,
    temperature: 19,
    humidity: 38
  }
];

const demoParticipants: Participant[] = [
  {
    id: 'part-001',
    name: 'TechCorp',
    role: 'manufacturer',
    location: {
      address: '123 Tech St, San Francisco, CA',
      latitude: 37.7749,
      longitude: -122.4194
    },
    products: ['prod-001', 'prod-002', 'prod-006'],
    walletAddress: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    walletBalance: 10.5
  },
  {
    id: 'part-002',
    name: 'ElectroVision',
    role: 'manufacturer',
    location: {
      address: '456 Vision Blvd, Los Angeles, CA',
      latitude: 34.0522,
      longitude: -118.2437
    },
    products: ['prod-003'],
    walletAddress: '0x2345678901234567890123456789012345678901',
    walletBalance: 8.2
  },
  {
    id: 'part-003',
    name: 'Global Shipping Inc.',
    role: 'distributor',
    location: {
      address: '789 Shipping Ave, Chicago, IL',
      latitude: 41.8781,
      longitude: -87.6298
    },
    products: ['prod-002'],
    walletAddress: '0x3456789012345678901234567890123456789012',
    walletBalance: 15.0
  },
  {
    id: 'part-004',
    name: 'ElectroMart',
    role: 'retailer',
    location: {
      address: '101 Retail Dr, New York, NY',
      latitude: 40.7128,
      longitude: -74.0060
    },
    products: ['prod-003'],
    walletAddress: '0x4567890123456789012345678901234567890123',
    walletBalance: 5.8
  },
  {
    id: 'part-005',
    name: 'TechRetail',
    role: 'retailer',
    location: {
      address: '202 Market St, Chicago, IL',
      latitude: 41.8781,
      longitude: -87.6298
    },
    products: ['prod-004'],
    walletAddress: '0x5678901234567890123456789012345678901234',
    walletBalance: 7.3
  },
  {
    id: 'part-006',
    name: 'ComponentSupply',
    role: 'supplier',
    location: {
      address: '303 Supply Rd, Boston, MA',
      latitude: 42.3601,
      longitude: -71.0589
    },
    products: [],
    walletAddress: '0x6789012345678901234567890123456789012345',
    walletBalance: 12.1
  },
  {
    id: 'part-007',
    name: 'GameTech',
    role: 'manufacturer',
    location: {
      address: '404 Gaming Ave, Tokyo, Japan',
      latitude: 35.6762,
      longitude: 139.6503
    },
    products: ['prod-005'],
    walletAddress: '0x7890123456789012345678901234567890123456',
    walletBalance: 9.4
  },
  {
    id: 'part-008',
    name: 'Asia Distribution Center',
    role: 'distributor',
    location: {
      address: '505 Port Way, Singapore',
      latitude: 1.3521,
      longitude: 103.8198
    },
    products: ['prod-006'],
    walletAddress: '0x8901234567890123456789012345678901234567',
    walletBalance: 11.7
  },
  {
    id: 'part-009',
    name: 'European Logistics Hub',
    role: 'distributor',
    location: {
      address: '606 Canal St, Amsterdam, Netherlands',
      latitude: 52.3676,
      longitude: 4.9041
    },
    products: ['prod-007'],
    walletAddress: '0x9012345678901234567890123456789012345678',
    walletBalance: 14.2
  },
  {
    id: 'part-010',
    name: 'Smart Living Store',
    role: 'retailer',
    location: {
      address: '707 Smart Rd, Paris, France',
      latitude: 48.8566,
      longitude: 2.3522
    },
    products: ['prod-008'],
    walletAddress: '0xa123456789012345678901234567890123456789',
    walletBalance: 6.9
  },
  {
    id: 'part-011',
    name: 'Photo Pro Store',
    role: 'retailer',
    location: {
      address: '808 Camera Lane, London, UK',
      latitude: 51.5074,
      longitude: -0.1278
    },
    products: ['prod-009'],
    walletAddress: '0xb234567890123456789012345678901234567890',
    walletBalance: 8.5
  },
  {
    id: 'part-012',
    name: 'EcoMotors',
    role: 'manufacturer',
    location: {
      address: '909 Electric Ave, San Jose, CA',
      latitude: 37.3382,
      longitude: -121.8863
    },
    products: ['prod-010'],
    walletAddress: '0xc345678901234567890123456789012345678901',
    walletBalance: 13.6
  }
];

export const SupplyChainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [{ products, participants }, setData] = useState(() => loadData());
  const [stats, setStats] = useState<SupplyChainStats>({
    totalProducts: 0,
    inTransitProducts: 0,
    deliveredProducts: 0,
    averageShippingTime: 0,
    suppliers: 0,
    manufacturers: 0,
    distributors: 0,
    retailers: 0
  });

  const calculateStats = (products: Product[], participants: Participant[]) => {
    const inTransit = products.filter(p => p.status === 'in-transit').length;
    const delivered = products.filter(p => p.status === 'delivered' || p.status === 'sold').length;
    const avgShippingTime = 3.5;
    const suppliers = participants.filter(p => p.role === 'supplier').length;
    const manufacturers = participants.filter(p => p.role === 'manufacturer').length;
    const distributors = participants.filter(p => p.role === 'distributor').length;
    const retailers = participants.filter(p => p.role === 'retailer').length;
    
    return {
      totalProducts: products.length,
      inTransitProducts: inTransit,
      deliveredProducts: delivered,
      averageShippingTime: avgShippingTime,
      suppliers,
      manufacturers,
      distributors,
      retailers
    };
  };

  useEffect(() => {
    setStats(calculateStats(products, participants));
    saveData(products, participants);
  }, [products, participants]);

  const addParticipant = async (participant: Omit<Participant, 'id' | 'products'>): Promise<void> => {
    const newParticipant: Participant = {
      id: `part-${(participants.length + 1).toString().padStart(3, '0')}`,
      ...participant,
      products: []
    };

    setData(prev => {
      const updated = {
        ...prev,
        participants: [...prev.participants, newParticipant]
      };
      saveData(updated.products, updated.participants);
      return updated;
    });
  };

  const addProduct = async (product: Omit<Product, 'id' | 'timestamp'>): Promise<void> => {
    const newProduct: Product = {
      id: `prod-${(products.length + 1).toString().padStart(3, '0')}`,
      ...product,
      timestamp: Date.now()
    };

    setData(prev => {
      const updatedProducts = [...prev.products, newProduct];
      const updatedParticipants = prev.participants.map(participant => {
        if (participant.name === product.manufacturer) {
          return {
            ...participant,
            products: [...participant.products, newProduct.id]
          };
        }
        return participant;
      });

      saveData(updatedProducts, updatedParticipants);
      return {
        products: updatedProducts,
        participants: updatedParticipants
      };
    });
  };

  const updateProductStatus = async (productId: string, status: Product['status']): Promise<void> => {
    setData(prev => {
      const updatedProducts = prev.products.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            status,
            timestamp: Date.now()
          };
        }
        return product;
      });

      saveData(updatedProducts, prev.participants);
      return {
        ...prev,
        products: updatedProducts
      };
    });
  };

  const getProduct = (id: string) => {
    return products.find(product => product.id === id);
  };

  const getParticipant = (id: string) => {
    return participants.find(participant => participant.id === id);
  };

  const trackProduct = (rfidTag: string) => {
    return products.find(product => product.rfidTag === rfidTag);
  };

  const transferProduct = async (productId: string, fromId: string, toId: string): Promise<boolean> => {
    try {
      setData(prev => {
        const updatedProducts = prev.products.map(product => {
          if (product.id === productId) {
            const toParticipant = prev.participants.find(p => p.id === toId);
            if (!toParticipant) return product;
            
            let newStatus: Product['status'] = product.status;
            if (toParticipant.role === 'distributor') {
              newStatus = 'in-transit';
            } else if (toParticipant.role === 'retailer') {
              newStatus = 'delivered';
            }
            
            return {
              ...product,
              currentLocation: {
                name: toParticipant.name,
                latitude: toParticipant.location.latitude,
                longitude: toParticipant.location.longitude,
              },
              status: newStatus,
              timestamp: Date.now()
            };
          }
          return product;
        });

        const updatedParticipants = prev.participants.map(participant => {
          if (participant.id === fromId) {
            return {
              ...participant,
              products: participant.products.filter(id => id !== productId)
            };
          }
          if (participant.id === toId) {
            return {
              ...participant,
              products: [...participant.products, productId]
            };
          }
          return participant;
        });

        saveData(updatedProducts, updatedParticipants);
        return {
          products: updatedProducts,
          participants: updatedParticipants
        };
      });
      
      return true;
    } catch (error) {
      console.error('Failed to transfer product:', error);
      return false;
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const data = loadData();
      setData(data);
      setStats(calculateStats(data.products, data.participants));
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <SupplyChainContext.Provider
      value={{
        products,
        participants,
        stats,
        loading,
        getProduct,
        getParticipant,
        trackProduct,
        transferProduct,
        refreshData,
        addParticipant,
        addProduct,
        updateProductStatus
      }}
    >
      {children}
    </SupplyChainContext.Provider>
  );
};

export const useSupplyChain = (): SupplyChainContextType => {
  const context = useContext(SupplyChainContext);
  if (context === undefined) {
    throw new Error('useSupplyChain must be used within a SupplyChainProvider');
  }
  return context;
};