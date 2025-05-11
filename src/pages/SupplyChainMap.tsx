import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Package, Building, TruckIcon, ShoppingBag, Pin } from 'lucide-react';
import { useSupplyChain } from '../contexts/SupplyChainContext';

// Use environment variable for Mapbox token
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const SupplyChainMap: React.FC = () => {
  const { products, participants } = useSupplyChain();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [viewState, setViewState] = useState({
    longitude: -98.5795, // Center of US
    latitude: 39.8283,
    zoom: 3.5
  });

  useEffect(() => {
    // If a marker is clicked, adjust the map to focus on it
    if (selectedItem) {
      setViewState({
        longitude: selectedItem.longitude,
        latitude: selectedItem.latitude,
        zoom: 5
      });
    }
  }, [selectedItem]);

  const getMarkerIcon = (role: string) => {
    switch (role) {
      case 'manufacturer':
        return <Building size={24} className="text-primary-500" />;
      case 'supplier':
        return <Package size={24} className="text-accent-500" />;
      case 'distributor':
        return <TruckIcon size={24} className="text-warning-500" />;
      case 'retailer':
        return <ShoppingBag size={24} className="text-success-500" />;
      default:
        return <Pin size={24} className="text-neutral-500" />;
    }
  };

  const getMarkerSize = (item: any) => {
    // Products are smaller than participants
    return item.rfidTag ? 24 : 32;
  };

  const getMarkerColor = (item: any) => {
    // For products
    if (item.rfidTag) {
      switch (item.status) {
        case 'manufactured':
          return 'bg-primary-100 border-primary-500';
        case 'in-transit':
          return 'bg-warning-100 border-warning-500';
        case 'delivered':
          return 'bg-success-100 border-success-500';
        case 'sold':
          return 'bg-neutral-100 border-neutral-500';
        default:
          return 'bg-neutral-100 border-neutral-500';
      }
    }
    
    // For participants
    switch (item.role) {
      case 'manufacturer':
        return 'bg-primary-100 border-primary-500';
      case 'supplier':
        return 'bg-accent-100 border-accent-500';
      case 'distributor':
        return 'bg-warning-100 border-warning-500';
      case 'retailer':
        return 'bg-success-100 border-success-500';
      default:
        return 'bg-neutral-100 border-neutral-500';
    }
  };

  const renderPopup = () => {
    if (!selectedItem) return null;
    
    // Product popup
    if (selectedItem.rfidTag) {
      return (
        <Popup
          longitude={selectedItem.currentLocation.longitude}
          latitude={selectedItem.currentLocation.latitude}
          anchor="bottom"
          onClose={() => setSelectedItem(null)}
          closeOnClick={false}
          className="z-10"
        >
          <div className="p-2 max-w-xs">
            <h3 className="font-medium text-lg">{selectedItem.name}</h3>
            <p className="text-sm text-neutral-600 mt-1">
              RFID: {selectedItem.rfidTag.substring(0, 10)}...
            </p>
            <p className="text-sm text-neutral-600">
              Status: <span className="capitalize">{selectedItem.status}</span>
            </p>
            <p className="text-sm text-neutral-600">
              Current Location: {selectedItem.currentLocation.name}
            </p>
            <div className="mt-2">
              <a 
                href={`/tracking?id=${selectedItem.id}`}
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                View Details
              </a>
            </div>
          </div>
        </Popup>
      );
    }
    
    // Participant popup
    return (
      <Popup
        longitude={selectedItem.location.longitude}
        latitude={selectedItem.location.latitude}
        anchor="bottom"
        onClose={() => setSelectedItem(null)}
        closeOnClick={false}
        className="z-10"
      >
        <div className="p-2 max-w-xs">
          <h3 className="font-medium text-lg">{selectedItem.name}</h3>
          <p className="text-sm text-neutral-600 mt-1 capitalize">
            Role: {selectedItem.role}
          </p>
          <p className="text-sm text-neutral-600">
            Address: {selectedItem.location.address}
          </p>
          <p className="text-sm text-neutral-600">
            Products: {selectedItem.products.length}
          </p>
          <div className="mt-2">
            <a 
              href={`/participants?id=${selectedItem.id}`}
              className="text-sm text-primary-600 hover:text-primary-800"
            >
              View Details
            </a>
          </div>
        </div>
      </Popup>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Supply Chain Map</h1>
          <p className="text-neutral-500 mt-1">View the global distribution of products and participants</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-primary-100 border-2 border-primary-500"></div>
              <span className="text-sm">Manufacturer</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-accent-100 border-2 border-accent-500"></div>
              <span className="text-sm">Supplier</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-warning-100 border-2 border-warning-500"></div>
              <span className="text-sm">Distributor</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-success-100 border-2 border-success-500"></div>
              <span className="text-sm">Retailer</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-neutral-100 border-2 border-neutral-500"></div>
              <span className="text-sm">Products</span>
            </div>
          </div>
        </div>
        
        <div className="h-[600px]">
          <Map
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
          >
            {/* Render participants */}
            {participants.map(participant => (
              <Marker
                key={`participant-${participant.id}`}
                longitude={participant.location.longitude}
                latitude={participant.location.latitude}
                anchor="center"
                onClick={e => {
                  e.originalEvent.stopPropagation();
                  setSelectedItem(participant);
                }}
              >
                <div 
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${getMarkerColor(participant)} cursor-pointer transition-all duration-200 hover:scale-110`}
                >
                  {getMarkerIcon(participant.role)}
                </div>
              </Marker>
            ))}
            
            {/* Render products */}
            {products.map(product => (
              <Marker
                key={`product-${product.id}`}
                longitude={product.currentLocation.longitude}
                latitude={product.currentLocation.latitude}
                anchor="center"
                onClick={e => {
                  e.originalEvent.stopPropagation();
                  setSelectedItem(product);
                }}
              >
                <div 
                  className={`flex items-center justify-center w-6 h-6 rounded-full border-2 ${getMarkerColor(product)} cursor-pointer transition-all duration-200 hover:scale-110`}
                >
                  <Package size={12} className="text-neutral-800" />
                </div>
              </Marker>
            ))}
            
            {/* Render popup for selected item */}
            {renderPopup()}
          </Map>
        </div>
      </div>
    </div>
  );
};

export default SupplyChainMap;