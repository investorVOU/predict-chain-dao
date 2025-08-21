// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTReward is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    enum MilestoneType {
        WALLET_CONNECTED,
        FIRST_PREDICTION,
        SUCCESSFUL_PREDICTION,
        TOP_PREDICTOR,
        COMMUNITY_CONTRIBUTOR,
        EARLY_ADOPTER,
        GOVERNANCE_PARTICIPANT,
        STREAK_MASTER,
        BIG_WINNER,
        DIAMOND_HANDS
    }

    struct Milestone {
        MilestoneType milestoneType;
        string name;
        string description;
        string imageURI;
        uint256 votingPowerBonus;
        bool isActive;
    }

    struct UserMilestones {
        mapping(MilestoneType => bool) achieved;
        uint256[] tokenIds;
        uint256 totalVotingPowerBonus;
    }

    mapping(MilestoneType => Milestone) public milestones;
    mapping(address => UserMilestones) private userMilestones;
    mapping(uint256 => MilestoneType) public tokenMilestones;
    
    // Tracking user activities for milestone verification
    mapping(address => bool) public hasConnectedWallet;
    mapping(address => uint256) public userPredictionCount;
    mapping(address => uint256) public successfulPredictions;
    mapping(address => uint256) public totalWinnings;
    mapping(address => uint256) public governanceVotes;
    mapping(address => uint256) public currentStreak;
    mapping(address => uint256) public maxStreak;

    event MilestoneAchieved(address indexed user, MilestoneType milestone, uint256 tokenId);
    event MilestoneCreated(MilestoneType milestone, string name, uint256 votingPowerBonus);

    constructor() ERC721("PredictChain Achievements", "PCNFT") {
        _initializeMilestones();
    }

    function _initializeMilestones() private {
        milestones[MilestoneType.WALLET_CONNECTED] = Milestone({
            milestoneType: MilestoneType.WALLET_CONNECTED,
            name: "First Connection",
            description: "Connected wallet to PredictChain",
            imageURI: "ipfs://QmWalletConnected",
            votingPowerBonus: 10,
            isActive: true
        });

        milestones[MilestoneType.FIRST_PREDICTION] = Milestone({
            milestoneType: MilestoneType.FIRST_PREDICTION,
            name: "Fortune Teller",
            description: "Made your first prediction",
            imageURI: "ipfs://QmFirstPrediction",
            votingPowerBonus: 25,
            isActive: true
        });

        milestones[MilestoneType.SUCCESSFUL_PREDICTION] = Milestone({
            milestoneType: MilestoneType.SUCCESSFUL_PREDICTION,
            name: "Oracle",
            description: "Successfully predicted an outcome",
            imageURI: "ipfs://QmSuccessfulPrediction",
            votingPowerBonus: 50,
            isActive: true
        });

        milestones[MilestoneType.TOP_PREDICTOR] = Milestone({
            milestoneType: MilestoneType.TOP_PREDICTOR,
            name: "Crystal Ball Master",
            description: "Top 10% predictor accuracy",
            imageURI: "ipfs://QmTopPredictor",
            votingPowerBonus: 100,
            isActive: true
        });

        milestones[MilestoneType.COMMUNITY_CONTRIBUTOR] = Milestone({
            milestoneType: MilestoneType.COMMUNITY_CONTRIBUTOR,
            name: "Community Builder",
            description: "Active contributor to the platform",
            imageURI: "ipfs://QmCommunityContributor",
            votingPowerBonus: 75,
            isActive: true
        });

        milestones[MilestoneType.GOVERNANCE_PARTICIPANT] = Milestone({
            milestoneType: MilestoneType.GOVERNANCE_PARTICIPANT,
            name: "Democracy Champion",
            description: "Participated in 5+ governance votes",
            imageURI: "ipfs://QmGovernanceParticipant",
            votingPowerBonus: 150,
            isActive: true
        });

        milestones[MilestoneType.EARLY_ADOPTER] = Milestone({
            milestoneType: MilestoneType.EARLY_ADOPTER,
            name: "Early Bird",
            description: "Among the first 100 users",
            imageURI: "ipfs://QmEarlyAdopter",
            votingPowerBonus: 200,
            isActive: true
        });

        milestones[MilestoneType.STREAK_MASTER] = Milestone({
            milestoneType: MilestoneType.STREAK_MASTER,
            name: "Streak Master",
            description: "5+ successful predictions in a row",
            imageURI: "ipfs://QmStreakMaster",
            votingPowerBonus: 125,
            isActive: true
        });

        milestones[MilestoneType.BIG_WINNER] = Milestone({
            milestoneType: MilestoneType.BIG_WINNER,
            name: "Big Winner",
            description: "Won 10+ ETH in total",
            imageURI: "ipfs://QmBigWinner",
            votingPowerBonus: 300,
            isActive: true
        });

        milestones[MilestoneType.DIAMOND_HANDS] = Milestone({
            milestoneType: MilestoneType.DIAMOND_HANDS,
            name: "Diamond Hands",
            description: "Held positions through major volatility",
            imageURI: "ipfs://QmDiamondHands",
            votingPowerBonus: 250,
            isActive: true
        });
    }

    function awardMilestone(address user, MilestoneType milestone) public onlyOwner {
        require(milestones[milestone].isActive, "Milestone not active");
        require(!userMilestones[user].achieved[milestone], "Milestone already achieved");

        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        _safeMint(user, tokenId);
        _setTokenURI(tokenId, milestones[milestone].imageURI);

        userMilestones[user].achieved[milestone] = true;
        userMilestones[user].tokenIds.push(tokenId);
        userMilestones[user].totalVotingPowerBonus += milestones[milestone].votingPowerBonus;
        tokenMilestones[tokenId] = milestone;

        emit MilestoneAchieved(user, milestone, tokenId);
    }

    function _awardMilestone(address user, MilestoneType milestone) internal {
        if (milestones[milestone].isActive && !userMilestones[user].achieved[milestone]) {
            _tokenIdCounter.increment();
            uint256 tokenId = _tokenIdCounter.current();

            _safeMint(user, tokenId);
            _setTokenURI(tokenId, milestones[milestone].imageURI);

            userMilestones[user].achieved[milestone] = true;
            userMilestones[user].tokenIds.push(tokenId);
            userMilestones[user].totalVotingPowerBonus += milestones[milestone].votingPowerBonus;
            tokenMilestones[tokenId] = milestone;

            emit MilestoneAchieved(user, milestone, tokenId);
        }
    }

    function checkAndAwardMilestones(address user) external {
        // Check wallet connection milestone
        if (!userMilestones[user].achieved[MilestoneType.WALLET_CONNECTED]) {
            hasConnectedWallet[user] = true;
            _awardMilestone(user, MilestoneType.WALLET_CONNECTED);
        }

        // Check first prediction milestone
        if (userPredictionCount[user] >= 1 && 
            !userMilestones[user].achieved[MilestoneType.FIRST_PREDICTION]) {
            _awardMilestone(user, MilestoneType.FIRST_PREDICTION);
        }

        // Check successful prediction milestone
        if (successfulPredictions[user] >= 1 && 
            !userMilestones[user].achieved[MilestoneType.SUCCESSFUL_PREDICTION]) {
            _awardMilestone(user, MilestoneType.SUCCESSFUL_PREDICTION);
        }

        // Check governance participation milestone
        if (governanceVotes[user] >= 5 && 
            !userMilestones[user].achieved[MilestoneType.GOVERNANCE_PARTICIPANT]) {
            _awardMilestone(user, MilestoneType.GOVERNANCE_PARTICIPANT);
        }

        // Check for big winner milestone (10+ ETH in winnings)
        if (totalWinnings[user] >= 10 ether && 
            !userMilestones[user].achieved[MilestoneType.BIG_WINNER]) {
            _awardMilestone(user, MilestoneType.BIG_WINNER);
        }

        // Check for streak master milestone (5+ successful predictions in a row)
        if (maxStreak[user] >= 5 && 
            !userMilestones[user].achieved[MilestoneType.STREAK_MASTER]) {
            _awardMilestone(user, MilestoneType.STREAK_MASTER);
        }
    }

    function updateUserActivity(
        address user,
        uint256 predictions,
        uint256 successfulPreds,
        uint256 winnings,
        uint256 govVotes,
        uint256 streak
    ) external onlyOwner {
        userPredictionCount[user] = predictions;
        successfulPredictions[user] = successfulPreds;
        totalWinnings[user] = winnings;
        governanceVotes[user] = govVotes;
        currentStreak[user] = streak;
        
        if (streak > maxStreak[user]) {
            maxStreak[user] = streak;
        }

        checkAndAwardMilestones(user);
    }

    function getUserMilestones(address user) external view returns (uint256[] memory, uint256) {
        return (userMilestones[user].tokenIds, userMilestones[user].totalVotingPowerBonus);
    }

    function hasMilestone(address user, MilestoneType milestone) external view returns (bool) {
        return userMilestones[user].achieved[milestone];
    }

    function getMilestoneInfo(MilestoneType milestone) external view returns (Milestone memory) {
        return milestones[milestone];
    }

    function createMilestone(
        MilestoneType milestoneType,
        string memory name,
        string memory description,
        string memory imageURI,
        uint256 votingPowerBonus
    ) external onlyOwner {
        milestones[milestoneType] = Milestone({
            milestoneType: milestoneType,
            name: name,
            description: description,
            imageURI: imageURI,
            votingPowerBonus: votingPowerBonus,
            isActive: true
        });

        emit MilestoneCreated(milestoneType, name, votingPowerBonus);
    }

    function updateMilestone(MilestoneType milestone, bool isActive) external onlyOwner {
        milestones[milestone].isActive = isActive;
    }

    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}