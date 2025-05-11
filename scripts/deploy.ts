import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contracts...");

  // Deploy ProductRegistry
  const ProductRegistry = await ethers.getContractFactory("ProductRegistry");
  const productRegistry = await ProductRegistry.deploy();
  await productRegistry.waitForDeployment();
  console.log("ProductRegistry deployed to:", await productRegistry.getAddress());

  // Deploy SupplyChainParticipant
  const SupplyChainParticipant = await ethers.getContractFactory("SupplyChainParticipant");
  const participantRegistry = await SupplyChainParticipant.deploy();
  await participantRegistry.waitForDeployment();
  console.log("SupplyChainParticipant deployed to:", await participantRegistry.getAddress());

  // Verify contracts on Etherscan
  console.log("\nVerifying contracts on Etherscan...");
  console.log("Waiting for 5 block confirmations...");
  await productRegistry.deploymentTransaction()?.wait(5);
  await participantRegistry.deploymentTransaction()?.wait(5);

  await run("verify:verify", {
    address: await productRegistry.getAddress(),
    constructorArguments: [],
  });

  await run("verify:verify", {
    address: await participantRegistry.getAddress(),
    constructorArguments: [],
  });

  console.log("\nDeployment complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});