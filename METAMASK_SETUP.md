# Setting up Hardhat Local Network in MetaMask

This guide will help you add the Hardhat local network to your MetaMask wallet on a new device.

## Prerequisites

- MetaMask browser extension installed
- Hardhat development environment running locally

## Steps

1. **Start Hardhat Node**
   ```bash
   npx hardhat node
   ```
   Keep this terminal window open while developing.

2. **Open MetaMask**
   - Click on the MetaMask extension icon in your browser
   - Log in to your wallet if needed

3. **Open Network Selection**
   - Click on the network dropdown at the top of MetaMask
   - Click "Add Network"
   - Select "Add a network manually"

4. **Add Hardhat Network**
   Enter the following details:
   ```
   Network Name: Hardhat Local
   New RPC URL: http://localhost:8545
   Chain ID: 31337
   Currency Symbol: ETH
   Block Explorer URL: (leave empty)
   ```

5. **Save Network**
   - Click "Save" to add the network
   - MetaMask will automatically switch to the new network

6. **Import Test Accounts (Optional)**
   If you need to import test accounts:
   - Get the private key from your Hardhat console output
   - In MetaMask, click the account circle
   - Select "Import Account"
   - Paste the private key and click "Import"

## Default Test Account

For development, you can import this test account:
```
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```
This is Hardhat's default first account with 10000 ETH.

## Troubleshooting

If you see "Could not fetch chain ID" error:
1. Ensure Hardhat node is running (`npx hardhat node`)
2. Try using `http://localhost:8545` instead of `http://127.0.0.1:8545`
3. Verify the Chain ID is exactly `31337`
4. Check if your firewall is not blocking the connection
5. Try clearing your browser cache and MetaMask activity data

Other common issues:
- Make sure no other process is using port 8545
- Verify you're connected to the correct network in MetaMask
- If using a VPN, try disconnecting it temporarily

## Security Note

Never use test private keys or accounts on mainnet or with real funds. These are for local development only.