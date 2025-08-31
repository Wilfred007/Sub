// import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";
// import * as dotenv from "dotenv";
// dotenv.config();

// const config: HardhatUserConfig = {
//   solidity: "^0.8.0",
//   networks: {
//     hardhat:{
//       forking:{
//         url: "https://eth-mainnet.g.alchemy.com/v2/Dkzcou9_1gcxZqm0gggXa8KkYykSIUsg"
//       }
//     },
//     // for testnet
//     "lisk-sepolia": {
//       url:  'https://rpc.sepolia-api.lisk.com',
//       accounts: [process.env.ACCOUNT_PRIVATE_KEY!],
//       gasPrice: 1000000000,
//     },
//   },
//   etherscan: {
//     // Use "123" as a placeholder, because Blockscout doesn't need a real API key, and Hardhat will complain if this property isn't set.
//     apiKey: {
//       "lisk-sepolia": "123",
//     },
//     customChains: [
//       {
//         network: "lisk-sepolia",
//         chainId: 4202,
//         urls: {
//           apiURL: "https://sepolia-blockscout.lisk.com/api",
//           browserURL: "https://sepolia-blockscout.lisk.com/",
//         },
//       },
//     ],
//   },
//   sourcify: {
//     enabled: false,
//   },
// };

// // export default config;

// // import { HardhatUserConfig } from "hardhat/config";
// // import "@nomicfoundation/hardhat-toolbox";

// // require('dotenv').config();

// // const config: HardhatUserConfig = {
// //   solidity: "0.8.18",
// //   networks: {
// //     // for testnet
// //     'lisk-sepolia': {
// //       url: 'https://rpc.sepolia-api.lisk.com',
// //       accounts: [process.env.ACCOUNT_PRIVATE_KEY as string],
// //       gasPrice: 1000000000,
// //     },
// //   },
// // };

// // export default config;


// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

console.log("🔧 Loading Hardhat configuration...");

const LISK_SEPOLIA_RPC_URL = process.env.LISK_SEPOLIA_RPC_URL || "https://rpc.sepolia-api.lisk.com";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

// Ensure private key is provided
if (!PRIVATE_KEY) {
  console.warn("⚠️  PRIVATE_KEY not found in environment variables");
  console.warn("📝 Create a .env file with your private key:");
  console.warn("   PRIVATE_KEY=your_wallet_private_key_here");
  console.warn("   LISK_SEPOLIA_RPC_URL=https://rpc.sepolia-api.lisk.com");
} else {
  console.log("✅ Private key loaded");
}

console.log("🌐 RPC URL:", LISK_SEPOLIA_RPC_URL);

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: {
    version: "0.8.20", // Updated to match OpenZeppelin v5.0.0
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true, // Enable for better optimization
    },
  },
  
  networks: {
    // Development network (local)
    hardhat: {
      chainId: 31337,
      gas: "auto",
      gasPrice: "auto",
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        count: 20,
      },
    },
    
    // Local development
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    
    // Lisk Sepolia Testnet
    liskSepolia: {
      url: LISK_SEPOLIA_RPC_URL,
      chainId: 4202,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gas: "auto",
      gasPrice: "auto",
      gasMultiplier: 1.2,
      timeout: 60000,
      httpHeaders: {},
    },
    
    // Alternative network name (for compatibility)
    "lisk-sepolia": {
      url: LISK_SEPOLIA_RPC_URL,
      chainId: 4202,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gas: "auto", 
      gasPrice: "auto",
      gasMultiplier: 1.2,
      timeout: 60000,
    },
  },
  
  // Contract verification
  etherscan: {
    apiKey: {
      liskSepolia: ETHERSCAN_API_KEY || "dummy", // Lisk uses different verification
    },
    customChains: [
      {
        network: "liskSepolia",
        chainId: 4202,
        urls: {
          apiURL: "https://sepolia-blockscout.lisk.com/api",
          browserURL: "https://sepolia-blockscout.lisk.com"
        }
      }
    ]
  },
  
  // Gas reporting
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    gasPrice: 1, // In gwei
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  
  // Contract paths
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  
  // Mocha testing configuration
  mocha: {
    timeout: 60000, // 60 seconds
  },
  
  // Default network for Hardhat tasks
  defaultNetwork: "hardhat",
};

console.log("✅ Hardhat configuration loaded successfully");
console.log("📋 Available networks:", Object.keys(config.networks || {}));

// Export the configuration
module.exports = config;