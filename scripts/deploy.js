const hre = require("hardhat");

async function main() {
  try {
    const Upload = await hre.ethers.getContractFactory("Upload");
    console.log("Deploying Upload contract...");
    
    const upload = await Upload.deploy();
    console.log("Upload contract deployed to:", await upload.getAddress());
    
    await upload.waitForDeployment();
    console.log("Deployment confirmed at address:", upload.target);
    
    // Verify the contract is working
    const deployedCode = await hre.ethers.provider.getCode(upload.target);
    if (deployedCode === '0x') {
      throw new Error('Contract deployment failed - no code at address');
    }
    
    return upload.target; // Return the deployment address
  } catch (error) {
    console.error("Deployment failed:", error);
    throw error;
  }
}

main()
  .then((address) => {
    console.log("Deployment successful!");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });