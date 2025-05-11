# BlockTrack - Blockchain Supply Chain Management with RFID

BlockTrack is a decentralized supply chain management application that combines blockchain technology with RFID tracking to provide complete transparency and traceability throughout the supply chain process.

## Features

- **Blockchain Integration**:

  - Secure and immutable record of all supply chain transactions
  - Smart contracts for product registry and participant management
  - MetaMask wallet integration for transaction signing
  - Real-time transaction tracking and verification

- **RFID Tracking**:

  - Real-time tracking of products using RFID technology
  - Temperature and humidity monitoring
  - QR code generation for easy product identification
  - Support for multiple RFID reader types (UHF, NFC, HF)

- **Supply Chain Visualization**:

  - Interactive global map showing product and participant locations
  - Real-time tracking of product movements
  - Supply chain network visualization
  - Participant relationship mapping

- **Inventory Management**:

  - Comprehensive product tracking
  - Real-time stock levels
  - Automated alerts for low inventory
  - Product history and lifecycle tracking

- **Participant Management**:

  - Role-based access control
  - Participant verification and authentication
  - Supply chain partner directory
  - Performance metrics and analytics

- **Payment Processing**:
  - Integrated cryptocurrency payments
  - Transaction history tracking
  - Automated payment settlements
  - Multi-wallet support

## Tech Stack

### Frontend

- React 18 with TypeScript
- Vite for fast development and building
- TailwindCSS for styling
- React Router for navigation
- Lucide React for icons
- Recharts for data visualization
- React Map GL with Mapbox for mapping
- Web3Modal for wallet connections

### Blockchain

- Ethereum Smart Contracts
- Hardhat for contract development
- ethers.js for blockchain interactions
- MetaMask wallet integration

### RFID Integration

- QR code generation with qrcode.react
- RFID scanning with @zxing/library
- Real-time sensor data processing
- Multi-format RFID support

### Data Management

- Context API for state management
- TypeScript for type safety
- date-fns for date handling
- MapBox for geolocation services

## Smart Contracts

The application uses three main smart contracts:

1. **ProductRegistry.sol**:

   - Product registration and tracking
   - RFID tag management
   - Product status updates
   - Sensor data recording

2. **SupplyChainParticipant.sol**:

   - Participant registration
   - Role management
   - Access control
   - Participant verification

3. **PaymentProcessor.sol**:
   - Payment processing
   - Transaction management
   - Balance tracking
   - Payment settlements

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/blocktrack.git
   cd blocktrack
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```
   VITE_MAPBOX_TOKEN=your_mapbox_token_here
   VITE_PRODUCT_REGISTRY_ADDRESS=your_contract_address
   VITE_PARTICIPANT_REGISTRY_ADDRESS=your_contract_address
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Deploy smart contracts (optional):
   ```bash
   npm run compile
   npm run deploy:sepolia
   ```

## Security Features

- Blockchain-based verification
- Role-based access control
- Secure wallet integration
- Transaction signing
- Data encryption
- Smart contract security

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - See LICENSE file for details
