require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    amoy: {
      url: process.env.ALCHEMY_URL, // Using Alchemy URL from .env
      accounts: [`0x${process.env.PRIVATE_KEY}`], // Your wallet private key
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
};
