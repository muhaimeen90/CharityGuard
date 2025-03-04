// require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config();

// module.exports = {
//   solidity: "0.8.20",
//   networks: {
//     amoy: {
//       url: process.env.ALCHEMY_URL, // Using Alchemy URL from .env
//       accounts: [`0x${process.env.PRIVATE_KEY}`], // Your wallet private key
//     },
//     localhost: {
//       url: "http://127.0.0.1:8545",
//     },
//   },
// };

// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const AMOY_RPC_URL = process.env.AMOY_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    amoy: {
      url: AMOY_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY, // Optional, for verification
  },
};
