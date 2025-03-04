// const hre = require("hardhat");

// async function main() {
//   const DonationPlatform = await hre.ethers.getContractFactory(
//     "DonationPlatform"
//   );
//   console.log("Deploying DonationPlatform...");

//   const donationPlatform = await DonationPlatform.deploy();

//   console.log("Waiting for contract deployment...");
//   await donationPlatform.waitForDeployment(); // Correct Ethers v6 method

//   const contractAddress = donationPlatform.target; // Correct way to get address in Ethers v6
//   console.log("✅ DonationPlatform deployed successfully to:", contractAddress);
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error("❌ Deployment failed:", error);
//     process.exit(1);
//   });

// deploy.js (Hardhat deploy script)
const hre = require("hardhat");

async function main() {
  const DonationPlatform = await hre.ethers.getContractFactory(
    "DonationPlatform"
  );
  const donationPlatform = await DonationPlatform.deploy({
    gasLimit: 18000000, // Adjust as needed
  });
  // const donationPlatform = await DonationPlatform.deploy();
  console.log(donationPlatform);
  //await donationPlatform.deployed();
  console.log(donationPlatform);
  console.log("DonationPlatform deployed to:", donationPlatform.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
