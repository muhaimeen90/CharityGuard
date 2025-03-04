// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

//const { buildModule } = require("@nomicfoundation/hardhat-ignition");

module.exports = buildModule("DonationPlatform", (m) => {
  const donate = m.contract("DonationPlatform"); // No args option needed

  return { donate };
});
