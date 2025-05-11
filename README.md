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

## Demo Flow

1. **Login**:

   - Use the demo account or connect with MetaMask
   - Explore different user roles (Manufacturer, Supplier, etc.)

2. **Product Tracking**:

   - Navigate to the Product Tracking page
   - Scan or enter an RFID tag (e.g., 0xABCD1234EFGH5678)
   - View real-time product information and history

3. **Supply Chain Map**:

   - Explore the interactive map
   - View product locations and movements
   - Click on markers for detailed information

4. **Inventory Management**:

   - Add new products
   - Update product status
   - View product details and history

5. **Transactions**:
   - Create new transactions
   - View transaction history
   - Check wallet balance

## Project Structure

```
src/
  ├── components/         # Reusable UI components
  │   ├── dashboard/     # Dashboard-specific components
  │   ├── layout/        # Layout components
  │   ├── tracking/      # RFID tracking components
  │   └── ui/           # Common UI components
  ├── contexts/          # React context providers
  ├── contracts/         # Smart contract ABIs and artifacts
  ├── pages/            # Application pages/routes
  ├── utils/            # Helper functions
  └── main.tsx          # Application entry point
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

## Support

For support, please open an issue in the GitHub repository or contact the development team.
