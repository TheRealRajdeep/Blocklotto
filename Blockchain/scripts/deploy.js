// scripts/deploy.js
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // Replace these with actual values for your target network.
  const subscriptionId = 1; // Your Chainlink VRF subscription ID
  const vrfCoordinator = "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B"; // e.g., Sepolia coordinator address
  const keyHash =
    "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae"; // Key hash provided by Chainlink for your network
  const interval = 86400; // 24 hours in seconds
  const minPlayers = 3; // Minimum number of players to trigger the lottery
  const jackpotThreshold = ethers.utils.parseEther("1"); // e.g., 1 ETH

  const Lottery = await ethers.getContractFactory("Lottery");
  const lottery = await Lottery.deploy(
    subscriptionId,
    vrfCoordinator,
    keyHash,
    interval,
    minPlayers,
    jackpotThreshold
  );
  await lottery.deployed();
  console.log("Lottery deployed to:", lottery.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
