// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";

contract Lottery is VRFConsumerBaseV2Plus, AutomationCompatibleInterface {
    // Basic lottery state
    address public i_owner; // renamed from "owner"
    address payable[] public players;
    uint256 public lotteryId;
    mapping(uint256 => address payable) public lotteryWinners;

    // Chainlink VRF configuration parameters
    uint256 public s_subscriptionId;
    bytes32 public keyHash;
    uint32 public callbackGasLimit;
    uint16 public requestConfirmations;
    uint32 public numWords;
    uint256 public lastRequestId;

    // Automated trigger parameters
    uint256 public interval; // e.g., 86400 for a 24-hour interval
    uint256 public lastTimeStamp; // timestamp when the last lottery round ended
    uint256 public minPlayers; // minimum number of players needed to trigger the lottery
    // uint256 public jackpotThreshold; // lottery balance threshold to trigger the draw

    // Entry fee per ticket
    uint256 public constant ENTRY_FEE = 0.0001 ether;

    // Events for transparency
    event TicketPurchased(address indexed buyer, uint256 numberOfTickets);
    event RandomnessRequested(uint256 requestId);
    event WinnerPicked(
        address indexed winner,
        uint256 prize,
        uint256 lotteryId
    );
    event LotteryRoundEnded(uint256 lotteryId);
    event LotteryRoundReset(uint256 newLotteryId, uint256 timestamp);

    /// @notice Restrict function access to contract owner
    modifier checkOwner() {
        require(msg.sender == i_owner, "Only owner can call this function");
        _;
    }

    constructor(
        uint256 subscriptionId,
        address vrfCoordinator,
        bytes32 _keyHash,
        uint256 _interval,
        uint256 _minPlayers
        // uint256 _jackpotThreshold
    ) VRFConsumerBaseV2Plus(vrfCoordinator) {
        i_owner = msg.sender;
        s_subscriptionId = subscriptionId;
        keyHash = _keyHash;
        // Set default VRF parameters; adjust as needed.
        callbackGasLimit = 100000;
        requestConfirmations = 3;
        numWords = 1; // Only one random number is needed to pick a winner

        // Set automated trigger parameters
        interval = _interval;
        lastTimeStamp = block.timestamp;
        minPlayers = _minPlayers;
        // jackpotThreshold = _jackpotThreshold;
    }

    /**
     * @notice Allows users to enter the lottery by buying multiple tickets in one transaction.
     * @param numberOfTickets The number of tickets to purchase
     */
    function enterLottery(uint256 numberOfTickets) public payable {
        require(numberOfTickets > 0, "Must buy at least one ticket");
        require(
            msg.value == ENTRY_FEE * numberOfTickets,
            "Incorrect ETH amount for tickets"
        );
        for (uint256 i = 0; i < numberOfTickets; i++) {
            players.push(payable(msg.sender));
        }
        emit TicketPurchased(msg.sender, numberOfTickets);
    }

    /**
     * @notice Manual trigger in case of emergency or special conditions
     */
    function manualPickWinner() external checkOwner {
        require(players.length > 0, "No players entered");
        _startLotteryDraw();
    }

    /**
     * @dev Internal function that requests randomness from Chainlink VRF
     */
    function _startLotteryDraw() internal {
        lastRequestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: keyHash,
                subId: s_subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );
        emit RandomnessRequested(lastRequestId);
    }

    /**
     * @notice Callback function called by the VRF coordinator with the random number
     * @dev Must match parent's signature, which uses calldata for the array
     */
    function fulfillRandomWords(
        uint256 /*_requestId*/,
        uint256[] calldata randomWords
    ) internal override {
        require(players.length > 0, "No players entered");
        uint256 winnerIndex = randomWords[0] % players.length;
        address payable winner = players[winnerIndex];
        uint256 prize = address(this).balance;

        // Update state before making any external calls.
        lotteryWinners[lotteryId] = winner;
        uint256 currentLotteryId = lotteryId;
        lotteryId++;
        delete players;
        lastTimeStamp = block.timestamp;

        // Transfer funds to the winner using call() for better reentrancy safety.
        (bool success, ) = winner.call{value: prize}("");
        require(success, "Transfer failed");

        emit WinnerPicked(winner, prize, currentLotteryId);
        emit LotteryRoundEnded(currentLotteryId);
        emit LotteryRoundReset(lotteryId, block.timestamp);
    }

    // --- Chainlink Automation Integration ---

    /**
     * @notice checkUpkeep is called by Chainlink Automation to determine if the lottery draw should occur.
     */
    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        bool timePassed = (block.timestamp - lastTimeStamp) >= interval;
        bool enoughPlayers = players.length >= minPlayers;
        // bool jackpotReached = address(this).balance >= jackpotThreshold;
        upkeepNeeded =
            (timePassed || enoughPlayers) &&
            (players.length > 0);
        performData = ""; // Empty bytes for unused parameter
        return (upkeepNeeded, performData);
    }

    /**
     * @notice performUpkeep is called by Chainlink Automation when checkUpkeep returns true.
     */
    function performUpkeep(bytes calldata /* performData */) external override {
        bool timePassed = (block.timestamp - lastTimeStamp) >= interval;
        bool enoughPlayers = players.length >= minPlayers;
        // bool jackpotReached = address(this).balance >= jackpotThreshold;
        if ((timePassed || enoughPlayers) && (players.length > 0)) {
            _startLotteryDraw();
        }
    }

    // --- Helper / Admin Functions ---

    /**
     * @notice Returns the list of current players.
     */
    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    /**
     * @notice Update the interval between lottery draws.
     */
    function updateInterval(uint256 newInterval) external checkOwner {
        interval = newInterval;
    }

    /**
     * @notice Update the minimum number of players required.
     */
    function updateMinPlayers(uint256 newMinPlayers) external checkOwner {
        minPlayers = newMinPlayers;
    }

    /**
     * @notice Update the jackpot threshold.
     */
    // function updateJackpotThreshold(uint256 newThreshold) external checkOwner {
    //     jackpotThreshold = newThreshold;
    // }
}
