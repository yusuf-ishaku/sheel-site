# 9BNB - Presale Platform

9BNB is a secure token presale platform with whitelist functionality built on React and Vite.

## Features

- 🔐 **Whitelist-based presale** - Only approved addresses can participate
- 💰 **BNB payments** - Accept payments in BNB with automatic conversion
- 📊 **Real-time stats** - Live tracking of presale progress and contributions
- 🛡️ **Security first** - Built-in validation and error handling
- 🎯 **Contribution limits** - Min 0.05 BNB, Max 0.1 BNB per wallet
- 🚀 **Modern UI** - Beautiful, responsive interface with TailwindCSS

## Getting Started

### Prerequisites
- Node.js 18+ 
- MetaMask or compatible wallet
- Sepolia testnet ETH for testing

### Installation
```bash
npm install
```

### Environment Setup
Create a `.env` file:
```
VITE_PRESALE_ADDRESS=0xYourContractAddress
VITE_RPC_URL=https://sepolia.your_rpc_provider.io
```

### Development
```bash
npm run dev
```

### Testing Contract
```bash
npm run smoke
```

## Tech Stack

- **Frontend**: React 19, Vite, TailwindCSS
- **Web3**: Wagmi, Viem, RainbowKit
- **UI**: React Hot Toast, React Icons
- **Blockchain**: Ethereum Sepolia testnet

Built with ❤️ by the 9BNB Team
