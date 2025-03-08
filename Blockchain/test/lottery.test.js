// test/lottery.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lottery Contract", function () {
  let Lottery, lottery, owner, player1, player2;
  const entryFee = ethers.utils.parseEther("0.1");

  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();
    Lottery = await ethers.getContractFactory("Lottery");
    // For testing, we use dummy values for VRF parameters.
    // Here, we pass owner's address as a dummy vrfCoordinator.
    lottery = await Lottery.deploy(
      1, // subscriptionId dummy value
      owner.address, // dummy vrfCoordinator
      "0x0000000000000000000000000000000000000000000000000000000000000000", // dummy keyHash
      60, // interval of 60 seconds
      1, // minPlayers = 1 for testing
      ethers.utils.parseEther("0.2") // jackpotThreshold of 0.2 ETH for testing
    );
    await lottery.deployed();
  });

  it("should allow a player to purchase multiple tickets", async function () {
    await lottery.connect(player1).enterLottery(3, { value: entryFee.mul(3) });
    const players = await lottery.getPlayers();
    expect(players.length).to.equal(3);
    // All tickets should be from player1
    for (let i = 0; i < players.length; i++) {
      expect(players[i]).to.equal(player1.address);
    }
  });

  it("should trigger manualPickWinner and set a request ID", async function () {
    await lottery.connect(player1).enterLottery(1, { value: entryFee });
    await lottery.manualPickWinner();
    expect(await lottery.lastRequestId()).to.not.equal(0);
  });
});
