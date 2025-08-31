// // // // ignition/modules/SimpleSubscription.ts - Ethers v6 Compatible
// // // import { ethers } from "hardhat";
// // // import fs from "fs";

// // // async function main() {
// // //   console.log("🚀 Deploying to Lisk Sepolia Testnet...");
// // //   console.log("=====================================");
  
// // //   // Get network info
// // //   const network = await ethers.provider.getNetwork();
// // //   console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);
  
// // //   // Verify we're on Lisk Sepolia - Fix the comparison issue
// // //   const chainId = Number(network.chainId);
// // //   if (chainId !== 4202) {
// // //     throw new Error(`❌ Wrong network! Expected Lisk Sepolia (4202), got ${chainId}`);
// // //   }
  
// // //   // Get deployer account
// // //   const [deployer] = await ethers.getSigners();
// // //   const deployerAddress = await deployer.getAddress();
// // //   console.log(`👤 Deployer: ${deployerAddress}`);
  
// // //   // Check balance
// // //   const balance = await ethers.provider.getBalance(deployerAddress);
// // //   const balanceEth = ethers.formatEther(balance); // v6 syntax
// // //   console.log(`💰 Balance: ${balanceEth} ETH`);
  
// // //   if (balance < ethers.parseEther("0.01")) { // v6 syntax
// // //     console.log("❌ Insufficient balance!");
// // //     console.log("💡 Get testnet ETH from: https://sepolia-faucet.lisk.com");
// // //     console.log(`💡 Send ETH to: ${deployerAddress}`);
// // //     throw new Error("Need at least 0.01 ETH for deployment");
// // //   }
  
// // //   console.log("✅ Balance sufficient for deployment");
// // //   console.log("");
  
// // //   // Deploy Mock USDT token first
// // //   console.log("📝 Step 1: Deploying Mock USDT token...");
// // //   const MockUSDT = await ethers.getContractFactory("MockUSDT");
  
// // //   console.log("⏳ Sending deployment transaction...");
// // //   const mockUSDT = await MockUSDT.deploy("Mock USDT", "USDT", 6, {
// // //     gasLimit: 2000000,
// // //     gasPrice: ethers.parseUnits("1", "gwei") // v6 syntax
// // //   });
  
// // //   console.log("⏳ Waiting for deployment confirmation...");
// // //   await mockUSDT.waitForDeployment(); // v6 syntax
// // //   const mockUSDTAddress = await mockUSDT.getAddress(); // v6 syntax
// // //   console.log(`✅ Mock USDT deployed to: ${mockUSDTAddress}`);
// // //   console.log(`🔗 View on explorer: https://sepolia-blockscout.lisk.com/address/${mockUSDTAddress}`);
// // //   console.log("");
  
// // //   // Deploy the subscription contract
// // //   console.log("📝 Step 2: Deploying Subscription Contract...");
// // //   const SubscriptionContract = await ethers.getContractFactory("AdvancedSubscription");
  
// // //   console.log("⏳ Sending deployment transaction...");
// // //   const subscription = await SubscriptionContract.deploy(mockUSDTAddress, deployerAddress, {
// // //     gasLimit: 2000000,
// // //     gasPrice: ethers.parseUnits("1", "gwei") // v6 syntax
// // //   });
  
// // //   console.log("⏳ Waiting for deployment confirmation...");
// // //   await subscription.waitForDeployment(); // v6 syntax
// // //   const subscriptionAddress = await subscription.getAddress(); // v6 syntax
// // //   console.log(`✅ Subscription contract deployed to: ${subscriptionAddress}`);
// // //   console.log(`🔗 View on explorer: https://sepolia-blockscout.lisk.com/address/${subscriptionAddress}`);
// // //   console.log("");
  
// // //   // Wait for additional confirmations
// // //   console.log("⏳ Waiting for 3 confirmations...");
// // //   const deployTx = subscription.deploymentTransaction();
// // //   if (deployTx) {
// // //     await deployTx.wait(3);
// // //   }
// // //   console.log("✅ Confirmations received");
// // //   console.log("");
  
// // //   // Verify deployment by calling functions
// // //   console.log("🧪 Step 3: Verifying deployment...");
// // //   const owner = await subscription.owner();
// // //   const usdtToken = await subscription.usdtToken();
// // //   console.log(`👑 Contract owner: ${owner}`);
// // //   console.log(`🪙 USDT token: ${usdtToken}`);
  
// // //   if (owner.toLowerCase() !== deployerAddress.toLowerCase()) {
// // //     throw new Error("❌ Contract owner mismatch!");
// // //   }
  
// // //   if (usdtToken.toLowerCase() !== mockUSDTAddress.toLowerCase()) {
// // //     throw new Error("❌ USDT token address mismatch!");
// // //   }
  
// // //   console.log("✅ Deployment verification passed");
// // //   console.log("");
  
// // //   // Create initial plans for testing
// // //   console.log("📋 Step 4: Creating initial test plans...");
  
// // //   const plans = [
// // //     {
// // //       name: "Basic Plan",
// // //       ethPrice: ethers.parseEther("0.001"), // 0.001 ETH (~$2)
// // //       usdtPrice: ethers.parseUnits("1", 6),   // 1 USDT
// // //       days: 30
// // //     },
// // //     {
// // //       name: "Premium Plan", 
// // //       ethPrice: ethers.parseEther("0.005"), // 0.005 ETH (~$10)
// // //       usdtPrice: ethers.parseUnits("5", 6),   // 5 USDT
// // //       days: 30
// // //     },
// // //     {
// // //       name: "Enterprise Plan",
// // //       ethPrice: ethers.parseEther("0.01"),  // 0.01 ETH (~$20)
// // //       usdtPrice: ethers.parseUnits("10", 6), // 10 USDT
// // //       days: 30
// // //     }
// // //   ];
  
// // //   for (let i = 0; i < plans.length; i++) {
// // //     const plan = plans[i];
// // //     console.log(`⏳ Creating ${plan.name}...`);
    
// // //     const tx = await subscription.createPlan(
// // //       plan.name,
// // //       plan.ethPrice,
// // //       plan.usdtPrice,
// // //       plan.days,
// // //       {
// // //         gasLimit: 200000,
// // //         gasPrice: ethers.parseUnits("1", "gwei") // v6 syntax
// // //       }
// // //     );
    
// // //     await tx.wait();
// // //     console.log(`✅ Created ${plan.name} (${ethers.formatEther(plan.ethPrice)} ETH / ${ethers.formatUnits(plan.usdtPrice, 6)} USDT)`);
// // //   }
  
// // //   console.log("");
  
// // //   // Mint some test USDT to the deployer
// // //   console.log("💰 Step 5: Minting test USDT...");
// // //   const mintTx = await mockUSDT.mint(
// // //     deployerAddress, 
// // //     ethers.parseUnits("1000", 6), // 1000 USDT
// // //     {
// // //       gasLimit: 100000,
// // //       gasPrice: ethers.parseUnits("1", "gwei") // v6 syntax
// // //     }
// // //   );
// // //   await mintTx.wait();
// // //   console.log("✅ Minted 1000 test USDT to deployer");
// // //   console.log("");
  
// // //   // Save deployment information
// // //   console.log("💾 Step 6: Saving deployment information...");
// // //   const deploymentInfo = {
// // //     network: "liskSepolia",
// // //     chainId: chainId,
// // //     timestamp: new Date().toISOString(),
// // //     deployer: deployerAddress,
// // //     deployerBalance: balanceEth,
// // //     contracts: {
// // //       subscription: subscriptionAddress,
// // //       mockUSDT: mockUSDTAddress
// // //     },
// // //     transactionHashes: {
// // //       subscription: deployTx?.hash || "unknown",
// // //       mockUSDT: (mockUSDT.deploymentTransaction())?.hash || "unknown"
// // //     },
// // //     blockNumbers: {
// // //       subscription: deployTx?.blockNumber || 0,
// // //       mockUSDT: (mockUSDT.deploymentTransaction())?.blockNumber || 0
// // //     },
// // //     gasUsed: {
// // //       subscription: deployTx?.gasLimit?.toString() || "2000000",
// // //       mockUSDT: (mockUSDT.deploymentTransaction())?.gasLimit?.toString() || "2000000"
// // //     },
// // //     plans: plans.map((plan, index) => ({
// // //       id: index,
// // //       name: plan.name,
// // //       ethPrice: ethers.formatEther(plan.ethPrice),
// // //       usdtPrice: ethers.formatUnits(plan.usdtPrice, 6),
// // //       days: plan.days
// // //     })),
// // //     urls: {
// // //       subscriptionExplorer: `https://sepolia-blockscout.lisk.com/address/${subscriptionAddress}`,
// // //       usdtExplorer: `https://sepolia-blockscout.lisk.com/address/${mockUSDTAddress}`,
// // //       faucet: "https://sepolia-faucet.lisk.com",
// // //       bridge: "https://bridge.lisk.com"
// // //     }
// // //   };
  
// // //   // Create deployments directory if it doesn't exist
// // //   if (!fs.existsSync("deployments")) {
// // //     fs.mkdirSync("deployments");
// // //   }
  
// // //   // Save deployment info
// // //   const filename = `deployments/lisk-sepolia-${Date.now()}.json`;
// // //   fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
// // //   console.log(`✅ Deployment info saved to: ${filename}`);
  
// // //   // Create environment variables file for easy access
// // //   const envUpdate = `
// // // # Updated after deployment - ${new Date().toISOString()}
// // // CONTRACT_ADDRESS=${subscriptionAddress}
// // // USDT_ADDRESS=${mockUSDTAddress}
// // // `;
  
// // //   fs.appendFileSync(".env.lisk", envUpdate);
// // //   console.log("✅ Updated .env.lisk with contract addresses");
// // //   console.log("");
  
// // //   // Final summary
// // //   console.log("🎉 DEPLOYMENT COMPLETE!");
// // //   console.log("=======================");
// // //   console.log("");
// // //   console.log("📄 Contract Addresses:");
// // //   console.log(`   Subscription: ${subscriptionAddress}`);
// // //   console.log(`   Mock USDT:    ${mockUSDTAddress}`);
// // //   console.log("");
// // //   console.log("🔗 Explorer Links:");
// // //   console.log(`   Subscription: https://sepolia-blockscout.lisk.com/address/${subscriptionAddress}`);
// // //   console.log(`   Mock USDT:    https://sepolia-blockscout.lisk.com/address/${mockUSDTAddress}`);
// // //   console.log("");
// // //   console.log("📋 Test Plans Created:");
// // //   plans.forEach((plan, index) => {
// // //     console.log(`   ${index}: ${plan.name} - ${ethers.formatEther(plan.ethPrice)} ETH / ${ethers.formatUnits(plan.usdtPrice, 6)} USDT`);
// // //   });
// // //   console.log("");
// // //   console.log("🔧 Frontend Configuration:");
// // //   console.log("   Add these to your React .env.local:");
// // //   console.log(`   REACT_APP_CONTRACT_ADDRESS=${subscriptionAddress}`);
// // //   console.log(`   REACT_APP_USDT_ADDRESS=${mockUSDTAddress}`);
// // //   console.log(`   REACT_APP_CHAIN_ID=4202`);
// // //   console.log("");
// // //   console.log("🚀 Next Steps:");
// // //   console.log("   1. Update your .env.lisk file (already done automatically)");
// // //   console.log("   2. Test the deployment: npm run test:lisk");
// // //   console.log("   3. Start monitoring: npm run monitor:lisk");
// // //   console.log("   4. Connect your frontend to use the contracts");
// // //   console.log("   5. Get test USDT: Use the faucet() function");
// // //   console.log("");
// // //   console.log("💡 Useful Commands:");
// // //   console.log("   npx hardhat console --network liskSepolia");
// // //   console.log("   npx hardhat verify --network liskSepolia " + subscriptionAddress + " " + mockUSDTAddress);
// // //   console.log("");
  
// // //   return {
// // //     subscription: subscriptionAddress,
// // //     mockUSDT: mockUSDTAddress,
// // //     deployer: deployerAddress
// // //   };
// // // }

// // // // Export for testing
// // // export default main;

// // // // Run deployment
// // // if (require.main === module) {
// // //   main()
// // //     .then(() => process.exit(0))
// // //     .catch((error) => {
// // //       console.error("❌ Deployment failed:", error);
// // //       process.exit(1);
// // //     });
// // // }


// // // scripts/deploy.ts

// import { ethers } from "hardhat";
// import fs from "fs";

// async function checkNetwork(expectedChainId: number) {
//   const network = await ethers.provider.getNetwork();
//   const chainId = Number(network.chainId);

//   console.log(`📡 Network: ${network.name} (Chain ID: ${chainId})`);
//   if (chainId !== expectedChainId) {
//     throw new Error(`❌ Wrong network! Expected ${expectedChainId}, got ${chainId}`);
//   }
// }

// async function getDeployer() {
//   const [deployer] = await ethers.getSigners();
//   const address = await deployer.getAddress();
//   const balance = await ethers.provider.getBalance(address);

//   console.log(`👤 Deployer: ${address}`);
//   console.log(`💰 Balance: ${ethers.formatEther(balance)} ETH`);

//   if (balance < ethers.parseEther("0.01")) {
//     throw new Error(`❌ Insufficient balance: ${ethers.formatEther(balance)} ETH`);
//   }

//   return { deployer, address, balance };
// }

// async function deployMockUSDT(deployer: any) {
//   console.log("📝 Deploying MockUSDT...");
//   const MockUSDT = await ethers.getContractFactory("MockUSDT", deployer);
//   const mockUSDT = await MockUSDT.deploy("Mock USDT", "USDT", 6, {
//     gasLimit: 2_000_000,
//     gasPrice: ethers.parseUnits("1", "gwei"),
//   });
//   await mockUSDT.waitForDeployment();
//   const address = await mockUSDT.getAddress();

//   console.log(`✅ MockUSDT deployed at: ${address}`);
//   return mockUSDT;
// }

// async function deploySubscription(mockUSDTAddress: string, deployer: any) {
//   console.log("📝 Deploying AdvancedSubscription...");
//   const Subscription = await ethers.getContractFactory("AdvancedSubscription", deployer);
//   // Fixed: Only pass mockUSDTAddress - the constructor only expects one parameter
//   const subscription = await Subscription.deploy(mockUSDTAddress, {
//     gasLimit: 2_000_000,
//     gasPrice: ethers.parseUnits("1", "gwei"),
//   });
//   await subscription.waitForDeployment();
//   const address = await subscription.getAddress();

//   console.log(`✅ AdvancedSubscription deployed at: ${address}`);
//   return subscription;
// }

// async function createPlans(subscription: any) {
//   console.log("📋 Creating subscription plans...");

//   const plans = [
//     { name: "Basic", eth: "0.001", usdt: "1", days: 30 },
//     { name: "Premium", eth: "0.005", usdt: "5", days: 30 },
//     { name: "Enterprise", eth: "0.01", usdt: "10", days: 30 },
//   ];

//   for (const plan of plans) {
//     console.log(`→ Creating ${plan.name} plan`);
//     const tx = await subscription.createPlan(
//       plan.name,
//       ethers.parseEther(plan.eth),
//       ethers.parseUnits(plan.usdt, 6),
//       plan.days,
//       { gasLimit: 200_000, gasPrice: ethers.parseUnits("1", "gwei") }
//     );
//     await tx.wait();
//     console.log(`✅ ${plan.name} plan created`);
//   }

//   return plans;
// }

// async function mintUSDT(mockUSDT: any, to: string) {
//   console.log(`💸 Minting 1000 USDT to ${to}`);
//   const tx = await mockUSDT.mint(to, ethers.parseUnits("1000", 6), {
//     gasLimit: 100_000,
//     gasPrice: ethers.parseUnits("1", "gwei"),
//   });
//   await tx.wait();
//   console.log("✅ Mint successful");
// }

// function saveDeploymentData(subscription: string, mockUSDT: string, deployer: string, plans: any[], chainId: number, balance: bigint) {
//   const timestamp = new Date().toISOString();

//   const data = {
//     timestamp,
//     network: "liskSepolia",
//     chainId,
//     deployer,
//     deployerBalance: ethers.formatEther(balance),
//     contracts: {
//       subscription,
//       mockUSDT,
//     },
//     plans: plans.map((p, i) => ({
//       id: i,
//       name: p.name,
//       ethPrice: p.eth,
//       usdtPrice: p.usdt,
//       duration: p.days,
//     })),
//   };

//   // Ensure deployments directory exists
//   if (!fs.existsSync("deployments")) {
//     fs.mkdirSync("deployments");
//   }

//   const filename = `deployments/lisk-sepolia-${Date.now()}.json`;
//   fs.writeFileSync(filename, JSON.stringify(data, null, 2));

//   // Create or append to .env.lisk file
//   const envContent = `\n# Deployed at ${timestamp}\nCONTRACT_ADDRESS=${subscription}\nUSDT_ADDRESS=${mockUSDT}\n`;
  
//   try {
//     fs.appendFileSync(".env.lisk", envContent);
//   } catch (error) {
//     // If file doesn't exist, create it
//     fs.writeFileSync(".env.lisk", envContent.trim());
//   }

//   console.log(`💾 Deployment info saved to ${filename}`);
//   console.log(`📝 Environment variables saved to .env.lisk`);
// }

// async function main() {
//   try {
//     console.log("🚀 Starting deployment to Lisk Sepolia...\n");

//     // Check we're on the correct network
//     await checkNetwork(4202);

//     // Get deployer account info
//     const { deployer, address: deployerAddress, balance } = await getDeployer();

//     // Deploy MockUSDT first
//     const mockUSDT = await deployMockUSDT(deployer);
//     const mockUSDTAddress = await mockUSDT.getAddress();

//     // Deploy AdvancedSubscription with only the USDT token address
//     const subscription = await deploySubscription(mockUSDTAddress, deployer);
//     const subscriptionAddress = await subscription.getAddress();

//     // Create subscription plans
//     const plans = await createPlans(subscription);

//     // Mint some USDT to the deployer for testing
//     await mintUSDT(mockUSDT, deployerAddress);

//     // Wait for deployment to be confirmed
//     console.log("⏳ Waiting for deployment confirmation...");
//     await subscription.deploymentTransaction()?.wait(3);

//     // Save deployment information
//     saveDeploymentData(subscriptionAddress, mockUSDTAddress, deployerAddress, plans, 4202, balance);

//     console.log("\n🎉 Deployment complete!");
//     console.log(`🔗 Subscription: https://sepolia-blockscout.lisk.com/address/${subscriptionAddress}`);
//     console.log(`🔗 Mock USDT:    https://sepolia-blockscout.lisk.com/address/${mockUSDTAddress}`);
//     console.log("✅ Ready for frontend integration");

//   } catch (error) {
//     console.error("❌ Deployment failed:", error);
//     process.exit(1);
//   }
// }

// // Export the main function for module usage
// export default main;

// // Run the script if called directly
// if (require.main === module) {
//   main();
// }


// import { ethers } from "hardhat";
// import fs from "fs";

// async function checkNetwork(expectedChainId: number) {
//   const network = await ethers.provider.getNetwork();
//   const chainId = Number(network.chainId);

//   console.log(`📡 Network: ${network.name} (Chain ID: ${chainId})`);
//   if (chainId !== expectedChainId) {
//     throw new Error(`❌ Wrong network! Expected ${expectedChainId}, got ${chainId}`);
//   }
// }

// async function getDeployer() {
//   const [deployer] = await ethers.getSigners();
//   const address = await deployer.getAddress();
//   const balance = await ethers.provider.getBalance(address);

//   console.log(`👤 Deployer: ${address}`);
//   console.log(`💰 Balance: ${ethers.formatEther(balance)} ETH`);

//   if (balance < ethers.parseEther("0.01")) {
//     throw new Error(`❌ Insufficient balance: ${ethers.formatEther(balance)} ETH`);
//   }

//   return { deployer, address, balance };
// }

// async function deployMockUSDT(deployer: any) {
//   console.log("📝 Deploying MockUSDT...");
//   const MockUSDT = await ethers.getContractFactory("MockUSDT", deployer);
//   const mockUSDT = await MockUSDT.deploy("Mock USDT", "USDT", 6, {
//     gasLimit: 1_000_000,
//     gasPrice: ethers.parseUnits("2", "gwei"),
//   });
//   await mockUSDT.waitForDeployment();
//   const address = await mockUSDT.getAddress();

//   console.log(`✅ MockUSDT deployed at: ${address}`);
//   return mockUSDT;
// }

// async function deployStreamlinedSubscription(mockUSDTAddress: string, deployer: any) {
//   console.log("📝 Deploying StreamlinedSubscription...");
//   const Subscription = await ethers.getContractFactory("StreamlinedSubscription", deployer);
  
//   // Estimate gas first
//   const gasEstimate = await Subscription.getDeployTransaction(mockUSDTAddress).then(tx => 
//     ethers.provider.estimateGas(tx)
//   );
  
//   console.log(`⛽ Estimated gas: ${gasEstimate.toLocaleString()}`);
  
//   const subscription = await Subscription.deploy(mockUSDTAddress, {
//     gasLimit: gasEstimate + BigInt(100000), // Add buffer
//     gasPrice: ethers.parseUnits("2", "gwei"),
//   });
  
//   await subscription.waitForDeployment();
//   const address = await subscription.getAddress();

//   console.log(`✅ StreamlinedSubscription deployed at: ${address}`);
//   return subscription;
// }

// async function createPlans(subscription: any) {
//   console.log("📋 Creating subscription plans...");

//   const plans = [
//     { name: "Basic", eth: "0.001", usdt: "1", days: 30 },
//     { name: "Premium", eth: "0.005", usdt: "5", days: 30 },
//     { name: "Enterprise", eth: "0.01", usdt: "10", days: 30 },
//   ];

//   for (const plan of plans) {
//     console.log(`→ Creating ${plan.name} plan`);
//     const tx = await subscription.createPlan(
//       plan.name,
//       ethers.parseEther(plan.eth),
//       ethers.parseUnits(plan.usdt, 6),
//       plan.days,
//       { gasLimit: 200_000, gasPrice: ethers.parseUnits("2", "gwei") }
//     );
//     await tx.wait();
//     console.log(`✅ ${plan.name} plan created`);
//   }

//   return plans;
// }

// async function mintUSDT(mockUSDT: any, to: string) {
//   console.log(`💸 Minting 1000 USDT to ${to}`);
//   const tx = await mockUSDT.mint(to, ethers.parseUnits("1000", 6), {
//     gasLimit: 100_000,
//     gasPrice: ethers.parseUnits("2", "gwei"),
//   });
//   await tx.wait();
//   console.log("✅ Mint successful");
// }

// function saveDeploymentData(subscription: string, mockUSDT: string, deployer: string, plans: any[], chainId: number, balance: bigint) {
//   const timestamp = new Date().toISOString();

//   const data = {
//     timestamp,
//     network: "liskSepolia",
//     chainId,
//     deployer,
//     deployerBalance: ethers.formatEther(balance),
//     contracts: {
//       subscription,
//       mockUSDT,
//     },
//     plans: plans.map((p, i) => ({
//       id: i,
//       name: p.name,
//       ethPrice: p.eth,
//       usdtPrice: p.usdt,
//       duration: p.days,
//     })),
//     contractType: "StreamlinedSubscription",
//     features: [
//       "ETH and USDT payments",
//       "Auto-renewal",
//       "Plan management", 
//       "Prepaid ETH balances"
//     ]
//   };

//   if (!fs.existsSync("deployments")) {
//     fs.mkdirSync("deployments");
//   }

//   const filename = `deployments/streamlined-lisk-sepolia-${Date.now()}.json`;
//   fs.writeFileSync(filename, JSON.stringify(data, null, 2));

//   const envContent = `\n# StreamlinedSubscription deployed at ${timestamp}\nSTREAMLINED_CONTRACT_ADDRESS=${subscription}\nUSDT_ADDRESS=${mockUSDT}\n`;
  
//   try {
//     fs.appendFileSync(".env.lisk", envContent);
//   } catch (error) {
//     fs.writeFileSync(".env.lisk", envContent.trim());
//   }

//   console.log(`💾 Deployment info saved to ${filename}`);
//   console.log(`📝 Environment variables saved to .env.lisk`);
// }

// async function testBasicFunctionality(subscription: any, mockUSDT: any, deployerAddress: string) {
//   console.log("\n🧪 Testing basic functionality...");
  
//   try {
//     // Test getting plans
//     const activePlans = await subscription.getActivePlans();
//     console.log(`✅ Found ${activePlans.length} active plans`);
    
//     // Test getting a specific plan
//     if (activePlans.length > 0) {
//       const planInfo = await subscription.getPlan(activePlans[0]);
//       console.log(`✅ Plan 0: ${planInfo[0]} - ${ethers.formatEther(planInfo[1])} ETH / ${ethers.formatUnits(planInfo[2], 6)} USDT`);
//     }
    
//     // Check USDT balance
//     const usdtBalance = await mockUSDT.balanceOf(deployerAddress);
//     console.log(`✅ USDT balance: ${ethers.formatUnits(usdtBalance, 6)} USDT`);
    
//     // Check ETH balance in contract
//     const ethBalance = await subscription.getETHBalance();
//     console.log(`✅ Contract ETH balance: ${ethers.formatEther(ethBalance)} ETH`);
    
//     console.log("✅ All basic tests passed!");
    
//   } catch (error) {
//     console.log("⚠️  Some functionality tests failed:", error.message);
//   }
// }

// async function main() {
//   try {
//     console.log("🚀 Deploying STREAMLINED Subscription Contract to Lisk Sepolia...\n");

//     await checkNetwork(4202);
//     const { deployer, address: deployerAddress, balance } = await getDeployer();

//     const mockUSDT = await deployMockUSDT(deployer);
//     const mockUSDTAddress = await mockUSDT.getAddress();

//     const subscription = await deployStreamlinedSubscription(mockUSDTAddress, deployer);
//     const subscriptionAddress = await subscription.getAddress();

//     const plans = await createPlans(subscription);
//     await mintUSDT(mockUSDT, deployerAddress);

//     // Wait for confirmations
//     console.log("⏳ Waiting for confirmations...");
//     await subscription.deploymentTransaction()?.wait(3);

//     // Test basic functionality
//     await testBasicFunctionality(subscription, mockUSDT, deployerAddress);

//     saveDeploymentData(subscriptionAddress, mockUSDTAddress, deployerAddress, plans, 4202, balance);

//     console.log("\n🎉 STREAMLINED DEPLOYMENT COMPLETE!");
//     console.log("=" .repeat(60));
//     console.log(`🔗 StreamlinedSubscription: https://sepolia-blockscout.lisk.com/address/${subscriptionAddress}`);
//     console.log(`🔗 Mock USDT:              https://sepolia-blockscout.lisk.com/address/${mockUSDTAddress}`);
//     console.log(`👤 Owner:                  ${deployerAddress}`);
//     console.log(`📊 Plans:                  ${plans.length} active plans`);
//     console.log("=" .repeat(60));
//     console.log("✅ Ready for frontend integration");
    
//     console.log("\n📚 CONTRACT FEATURES:");
//     console.log("  ✅ ETH and USDT subscription payments");
//     console.log("  ✅ Auto-renewal with prepaid ETH balances");
//     console.log("  ✅ Plan management (create, toggle)");
//     console.log("  ✅ Subscription management (subscribe, renew)");
//     console.log("  ✅ Owner revenue withdrawal");

//   } catch (error) {
//     console.error("\n❌ DEPLOYMENT FAILED:");
//     console.error("=" .repeat(60));
//     console.error("Error:", error.message);
//     process.exit(1);
//   }
// }

// export default main;

// if (require.main === module) {
//   main();
// }



import { ethers } from "hardhat";
import fs from "fs";

async function checkNetwork(expectedChainId: number) {
  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);

  console.log(`📡 Network: ${network.name} (Chain ID: ${chainId})`);
  if (chainId !== expectedChainId) {
    throw new Error(`❌ Wrong network! Expected ${expectedChainId}, got ${chainId}`);
  }
}

async function getDeployer() {
  const [deployer] = await ethers.getSigners();
  const address = await deployer.getAddress();
  const balance = await ethers.provider.getBalance(address);

  console.log(`👤 Deployer: ${address}`);
  console.log(`💰 Balance: ${ethers.formatEther(balance)} ETH`);

  if (balance < ethers.parseEther("0.01")) {
    throw new Error(`❌ Insufficient balance: ${ethers.formatEther(balance)} ETH`);
  }

  return { deployer, address, balance };
}

async function deploySimpleMockUSDT(deployer: any) {
  console.log("📝 Deploying SimpleMockUSDT...");
  
  try {
    const SimpleMockUSDT = await ethers.getContractFactory("SimpleMockUSDT", deployer);
    
    // Check bytecode size first
    const bytecodeSize = (SimpleMockUSDT.bytecode.length - 2) / 2;
    console.log(`📏 SimpleMockUSDT size: ${bytecodeSize.toLocaleString()} bytes`);
    
    // Estimate gas
    const deployData = SimpleMockUSDT.interface.encodeDeploy(["Mock USDT", "USDT", 6]);
    const gasEstimate = await ethers.provider.estimateGas({
      data: SimpleMockUSDT.bytecode + deployData.slice(2)
    });
    
    console.log(`⛽ Gas estimate: ${gasEstimate.toLocaleString()}`);
    
    const mockUSDT = await SimpleMockUSDT.deploy("Mock USDT", "USDT", 6, {
      gasLimit: gasEstimate + BigInt(100000), // Add buffer
      gasPrice: ethers.parseUnits("2", "gwei"),
    });
    
    console.log("⏳ Waiting for SimpleMockUSDT deployment...");
    await mockUSDT.waitForDeployment();
    const address = await mockUSDT.getAddress();

    console.log(`✅ SimpleMockUSDT deployed at: ${address}`);
    
    // Verify it works
    const name = await mockUSDT.name();
    const symbol = await mockUSDT.symbol();
    const decimals = await mockUSDT.decimals();
    console.log(`📋 Verified: ${name} (${symbol}) with ${decimals} decimals`);
    
    return mockUSDT;
    
  } catch (error) {
    console.error("❌ SimpleMockUSDT deployment failed:", error.message);
    throw error;
  }
}

async function deployStreamlinedSubscription(mockUSDTAddress: string, deployer: any) {
  console.log("📝 Deploying StreamlinedSubscription...");
  console.log(`🔗 Using USDT address: ${mockUSDTAddress}`);
  
  try {
    const Subscription = await ethers.getContractFactory("StreamlinedSubscription", deployer);
    
    // Check bytecode size
    const bytecodeSize = (Subscription.bytecode.length - 2) / 2;
    console.log(`📏 StreamlinedSubscription size: ${bytecodeSize.toLocaleString()} bytes`);
    
    // Estimate gas
    const deployData = Subscription.interface.encodeDeploy([mockUSDTAddress]);
    const gasEstimate = await ethers.provider.estimateGas({
      data: Subscription.bytecode + deployData.slice(2)
    });
    
    console.log(`⛽ Gas estimate: ${gasEstimate.toLocaleString()}`);
    
    const subscription = await Subscription.deploy(mockUSDTAddress, {
      gasLimit: gasEstimate + BigInt(200000), // Add buffer
      gasPrice: ethers.parseUnits("2", "gwei"),
    });
    
    console.log("⏳ Waiting for StreamlinedSubscription deployment...");
    await subscription.waitForDeployment();
    const address = await subscription.getAddress();

    console.log(`✅ StreamlinedSubscription deployed at: ${address}`);
    
    // Verify it works
    const owner = await subscription.owner();
    const planCounter = await subscription.planCounter();
    console.log(`📋 Verified: Owner ${owner}, Plan Counter: ${planCounter}`);
    
    return subscription;
    
  } catch (error) {
    console.error("❌ StreamlinedSubscription deployment failed:", error.message);
    throw error;
  }
}

async function createPlans(subscription: any) {
  console.log("📋 Creating subscription plans...");

  const plans = [
    { name: "Basic", eth: "0.001", usdt: "1", days: 30 },
    { name: "Premium", eth: "0.005", usdt: "5", days: 30 },
    { name: "Enterprise", eth: "0.01", usdt: "10", days: 30 },
  ];

  for (const plan of plans) {
    console.log(`→ Creating ${plan.name} plan`);
    
    try {
      // Estimate gas first
      const gasEstimate = await subscription.createPlan.estimateGas(
        plan.name,
        ethers.parseEther(plan.eth),
        ethers.parseUnits(plan.usdt, 6),
        plan.days
      );
      
      const tx = await subscription.createPlan(
        plan.name,
        ethers.parseEther(plan.eth),
        ethers.parseUnits(plan.usdt, 6),
        plan.days,
        { 
          gasLimit: gasEstimate + BigInt(50000),
          gasPrice: ethers.parseUnits("2", "gwei") 
        }
      );
      
      await tx.wait();
      console.log(`✅ ${plan.name} plan created`);
      
    } catch (error) {
      console.error(`❌ Failed to create ${plan.name} plan:`, error.message);
      throw error;
    }
  }

  return plans;
}

async function mintUSDT(mockUSDT: any, to: string) {
  console.log(`💸 Minting 1000 USDT to ${to}`);
  
  try {
    const amount = ethers.parseUnits("1000", 6);
    const gasEstimate = await mockUSDT.mint.estimateGas(to, amount);
    
    const tx = await mockUSDT.mint(to, amount, {
      gasLimit: gasEstimate + BigInt(20000),
      gasPrice: ethers.parseUnits("2", "gwei"),
    });
    
    await tx.wait();
    console.log("✅ Mint successful");
    
    // Verify balance
    const balance = await mockUSDT.balanceOf(to);
    console.log(`💰 USDT Balance: ${ethers.formatUnits(balance, 6)} USDT`);
    
  } catch (error) {
    console.error("❌ Mint failed:", error.message);
    throw error;
  }
}

function saveDeploymentData(subscription: string, mockUSDT: string, deployer: string, plans: any[], chainId: number, balance: bigint) {
  const timestamp = new Date().toISOString();

  const data = {
    timestamp,
    network: "liskSepolia",
    chainId,
    deployer,
    deployerBalance: ethers.formatEther(balance),
    contracts: {
      streamlinedSubscription: subscription,
      simpleMockUSDT: mockUSDT,
    },
    plans: plans.map((p, i) => ({
      id: i,
      name: p.name,
      ethPrice: p.eth,
      usdtPrice: p.usdt,
      duration: p.days,
    })),
    contractType: "StreamlinedSubscription with SimpleMockUSDT"
  };

  if (!fs.existsSync("deployments")) {
    fs.mkdirSync("deployments");
  }

  const filename = `deployments/streamlined-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));

  const envContent = `\n# StreamlinedSubscription deployed at ${timestamp}\nSTREAMLINED_CONTRACT=${subscription}\nSIMPLE_USDT_CONTRACT=${mockUSDT}\n`;
  
  try {
    fs.appendFileSync(".env.lisk", envContent);
  } catch (error) {
    fs.writeFileSync(".env.lisk", envContent.trim());
  }

  console.log(`💾 Deployment saved to ${filename}`);
  console.log(`📝 Environment variables saved to .env.lisk`);
}

async function main() {
  try {
    console.log("🚀 FIXED STREAMLINED DEPLOYMENT to Lisk Sepolia...\n");

    await checkNetwork(4202);
    const { deployer, address: deployerAddress, balance } = await getDeployer();

    // Deploy SimpleMockUSDT (much smaller and simpler)
    const mockUSDT = await deploySimpleMockUSDT(deployer);
    const mockUSDTAddress = await mockUSDT.getAddress();

    // Deploy StreamlinedSubscription
    const subscription = await deployStreamlinedSubscription(mockUSDTAddress, deployer);
    const subscriptionAddress = await subscription.getAddress();

    // Create plans
    const plans = await createPlans(subscription);
    
    // Mint test USDT
    await mintUSDT(mockUSDT, deployerAddress);

    // Wait for confirmations
    console.log("⏳ Waiting for confirmations...");
    await subscription.deploymentTransaction()?.wait(3);

    // Save deployment info
    saveDeploymentData(subscriptionAddress, mockUSDTAddress, deployerAddress, plans, 4202, balance);

    console.log("\n🎉 DEPLOYMENT SUCCESSFUL!");
    console.log("=" .repeat(70));
    console.log(`🔗 StreamlinedSubscription: https://sepolia-blockscout.lisk.com/address/${subscriptionAddress}`);
    console.log(`🔗 SimpleMockUSDT:         https://sepolia-blockscout.lisk.com/address/${mockUSDTAddress}`);
    console.log(`👤 Owner:                  ${deployerAddress}`);
    console.log(`📊 Plans created:          ${plans.length}`);
    console.log("=" .repeat(70));
    console.log("✅ Ready for testing!");

  } catch (error) {
    console.error("\n❌ DEPLOYMENT FAILED:");
    console.error("=" .repeat(70));
    console.error("Error:", error.message);
    
    if (error.message.includes("contract creation code storage out of gas")) {
      console.log("\n💡 Contract still too large. Try:");
      console.log("1. Enable optimizer: { enabled: true, runs: 1000 }");
      console.log("2. Recompile: npx hardhat clean && npx hardhat compile");
    }
    
    process.exit(1);
  }
}

export default main;

if (require.main === module) {
  main();
}