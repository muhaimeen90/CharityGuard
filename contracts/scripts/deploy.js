const hre = require("hardhat");

async function main() {
  const DonationPlatform = await hre.ethers.getContractFactory(
    "DonationPlatform"
  );
  console.log("Deploying DonationPlatform...");

  const donationPlatform = await DonationPlatform.deploy();

  console.log("Waiting for contract deployment...");
  await donationPlatform.waitForDeployment(); // Correct Ethers v6 method

  const contractAddress = donationPlatform.target; // Correct way to get address in Ethers v6
  console.log("✅ DonationPlatform deployed successfully to:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
