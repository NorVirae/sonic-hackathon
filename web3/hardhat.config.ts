import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import dotenv from "dotenv";

dotenv.config();

const USER_PRIVATE_KEY = process.env.PRIVATE_KEY || ""

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.0", // Your primary Solidity version
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },

      {
        version: "0.8.20", // Your primary Solidity version
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.7.6", // Add support for Uniswap contracts
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://enugu-rpc.assetchain.org/", // Replace with your provider's RPC URL
        blockNumber: 222000, // Optional: specify a block number for consistent testing
      },
    },
    assetchain: {
      url: "https://enugu-rpc.assetchain.org/",
      accounts: [USER_PRIVATE_KEY],
      chainId: 42421
    }
  },
  etherscan: {
    apiKey: {
      assetchain_test: "abc"
    },
    customChains: [
      {
        network: "assetchain_test",
        chainId: 42421,
        urls: {
          apiURL: "https://scan-testnet.assetchain.org/api",
          browserURL: "https://scan-testnet.assetchain.org/"
        }
      }
    ]
  }
}

export default config;
