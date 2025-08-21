// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./NFTReward.sol";

contract UserProfile is Ownable {
    struct Profile {
        address userAddress;
        string username;
        string bio;
        string avatarURI;
        uint256 totalPredictions;
        uint256 successfulPredictions;
        uint256 totalEarnings;
        uint256 totalLosses;
        uint256 currentStreak;
        uint256 longestStreak;
        uint256 reputationScore;
        uint256 joinDate;
        bool isVerified;
        uint256[] marketIds;
        uint256[] betIds;
    }

    struct PredictionHistory {
        uint256 marketId;
        string position;
        uint256 amount;
        uint256 timestamp;
        bool isWon;
        uint256 payout;
    }

    struct ReputationMetrics {
        uint256 accuracyScore;      // Based on successful predictions
        uint256 participationScore; // Based on total activity
        uint256 earlyAdopterScore;  // Bonus for early participation
        uint256 consistencyScore;   // Based on streaks and regular activity
        uint256 governanceScore;    // Based on DAO participation
    }

    mapping(address => Profile) public profiles;
    mapping(address => bool) public profileExists;
    mapping(string => address) public usernameToAddress;
    mapping(address => PredictionHistory[]) public userPredictionHistory;
    mapping(address => ReputationMetrics) public reputationMetrics;
    
    address public nftRewardContract;
    address public daoContract;
    address public predictionMarketContract;

    uint256 public constant REPUTATION_DECIMALS = 100;
    uint256 public totalUsers;

    event ProfileCreated(address indexed user, string username);
    event ProfileUpdated(address indexed user, string field);
    event ReputationUpdated(address indexed user, uint256 newScore);
    event PredictionRecorded(address indexed user, uint256 marketId, string position, uint256 amount);

    constructor() {}

    function setContracts(
        address _nftRewardContract,
        address _daoContract,
        address _predictionMarketContract
    ) external onlyOwner {
        nftRewardContract = _nftRewardContract;
        daoContract = _daoContract;
        predictionMarketContract = _predictionMarketContract;
    }

    function createProfile(
        string memory username,
        string memory bio,
        string memory avatarURI
    ) external {
        require(!profileExists[msg.sender], "Profile already exists");
        require(bytes(username).length > 0 && bytes(username).length <= 50, "Invalid username length");
        require(usernameToAddress[username] == address(0), "Username already taken");

        profiles[msg.sender] = Profile({
            userAddress: msg.sender,
            username: username,
            bio: bio,
            avatarURI: avatarURI,
            totalPredictions: 0,
            successfulPredictions: 0,
            totalEarnings: 0,
            totalLosses: 0,
            currentStreak: 0,
            longestStreak: 0,
            reputationScore: 100 * REPUTATION_DECIMALS, // Starting reputation
            joinDate: block.timestamp,
            isVerified: false,
            marketIds: new uint256[](0),
            betIds: new uint256[](0)
        });

        profileExists[msg.sender] = true;
        usernameToAddress[username] = msg.sender;
        totalUsers++;

        emit ProfileCreated(msg.sender, username);
        
        // Award wallet connection milestone
        if (nftRewardContract != address(0)) {
            NFTReward(nftRewardContract).checkAndAwardMilestones(msg.sender);
        }
    }

    function updateProfile(
        string memory bio,
        string memory avatarURI
    ) external {
        require(profileExists[msg.sender], "Profile does not exist");
        
        profiles[msg.sender].bio = bio;
        profiles[msg.sender].avatarURI = avatarURI;

        emit ProfileUpdated(msg.sender, "bio_avatar");
    }

    function recordPrediction(
        address user,
        uint256 marketId,
        uint256 betId,
        string memory position,
        uint256 amount
    ) external {
        require(msg.sender == predictionMarketContract, "Only prediction market can record");
        require(profileExists[user], "User profile does not exist");

        profiles[user].totalPredictions++;
        profiles[user].marketIds.push(marketId);
        profiles[user].betIds.push(betId);

        userPredictionHistory[user].push(PredictionHistory({
            marketId: marketId,
            position: position,
            amount: amount,
            timestamp: block.timestamp,
            isWon: false, // Will be updated when market resolves
            payout: 0
        }));

        emit PredictionRecorded(user, marketId, position, amount);
        _updateReputationScore(user);

        // Update NFT milestone progress
        if (nftRewardContract != address(0)) {
            NFTReward(nftRewardContract).updateUserActivity(
                user,
                profiles[user].totalPredictions,
                profiles[user].successfulPredictions,
                profiles[user].totalEarnings,
                0, // Governance votes would come from DAO contract
                profiles[user].currentStreak
            );
        }
    }

    function recordPredictionResult(
        address user,
        uint256 marketId,
        bool won,
        uint256 payout
    ) external {
        require(msg.sender == predictionMarketContract, "Only prediction market can record");
        require(profileExists[user], "User profile does not exist");

        if (won) {
            profiles[user].successfulPredictions++;
            profiles[user].totalEarnings += payout;
            profiles[user].currentStreak++;
            
            if (profiles[user].currentStreak > profiles[user].longestStreak) {
                profiles[user].longestStreak = profiles[user].currentStreak;
            }
        } else {
            profiles[user].currentStreak = 0;
            // totalLosses would be the amount lost
        }

        // Update prediction history
        PredictionHistory[] storage history = userPredictionHistory[user];
        for (uint256 i = history.length; i > 0; i--) {
            if (history[i-1].marketId == marketId && !history[i-1].isWon && history[i-1].payout == 0) {
                history[i-1].isWon = won;
                history[i-1].payout = payout;
                break;
            }
        }

        _updateReputationScore(user);

        // Update NFT milestone progress
        if (nftRewardContract != address(0)) {
            NFTReward(nftRewardContract).updateUserActivity(
                user,
                profiles[user].totalPredictions,
                profiles[user].successfulPredictions,
                profiles[user].totalEarnings,
                0,
                profiles[user].currentStreak
            );
        }
    }

    function _updateReputationScore(address user) internal {
        Profile storage profile = profiles[user];
        ReputationMetrics storage metrics = reputationMetrics[user];

        // Calculate accuracy score (0-300 points)
        if (profile.totalPredictions > 0) {
            metrics.accuracyScore = (profile.successfulPredictions * 300) / profile.totalPredictions;
        }

        // Calculate participation score (0-200 points)
        metrics.participationScore = profile.totalPredictions > 200 ? 200 : profile.totalPredictions;

        // Calculate early adopter bonus (0-100 points)
        if (totalUsers <= 1000 && profile.joinDate < block.timestamp - 30 days) {
            metrics.earlyAdopterScore = 100;
        } else if (totalUsers <= 5000 && profile.joinDate < block.timestamp - 14 days) {
            metrics.earlyAdopterScore = 50;
        }

        // Calculate consistency score based on streaks (0-200 points)
        metrics.consistencyScore = profile.longestStreak > 20 ? 200 : (profile.longestStreak * 10);

        // Total reputation score
        uint256 newScore = metrics.accuracyScore + metrics.participationScore + 
                          metrics.earlyAdopterScore + metrics.consistencyScore + metrics.governanceScore;

        profile.reputationScore = newScore;
        emit ReputationUpdated(user, newScore);
    }

    function updateGovernanceParticipation(address user, uint256 votesCount) external {
        require(msg.sender == daoContract, "Only DAO can update governance");
        require(profileExists[user], "User profile does not exist");

        reputationMetrics[user].governanceScore = votesCount > 50 ? 100 : (votesCount * 2);
        _updateReputationScore(user);
    }

    function getProfile(address user) external view returns (Profile memory) {
        require(profileExists[user], "Profile does not exist");
        return profiles[user];
    }

    function getUserPredictionHistory(address user) external view returns (PredictionHistory[] memory) {
        require(profileExists[user], "Profile does not exist");
        return userPredictionHistory[user];
    }

    function getReputationMetrics(address user) external view returns (ReputationMetrics memory) {
        require(profileExists[user], "Profile does not exist");
        return reputationMetrics[user];
    }

    function getTopUsers(uint256 limit) external view returns (address[] memory) {
        require(limit > 0 && limit <= 100, "Invalid limit");
        
        address[] memory topUsers = new address[](limit);
        uint256[] memory topScores = new uint256[](limit);
        uint256 count = 0;

        // This is a simplified approach - in production, you'd want more efficient sorting
        for (uint256 i = 0; i < totalUsers && count < limit; i++) {
            // You'd need to implement a way to iterate through all users
            // This is pseudocode as Solidity doesn't have good ways to iterate mappings
        }

        return topUsers;
    }

    function getUserStats(address user) external view returns (
        uint256 totalPredictions,
        uint256 successfulPredictions,
        uint256 accuracyRate,
        uint256 totalEarnings,
        uint256 currentStreak,
        uint256 reputationScore
    ) {
        require(profileExists[user], "Profile does not exist");
        
        Profile storage profile = profiles[user];
        uint256 accuracy = profile.totalPredictions > 0 ? 
            (profile.successfulPredictions * 10000) / profile.totalPredictions : 0;

        return (
            profile.totalPredictions,
            profile.successfulPredictions,
            accuracy, // Accuracy in basis points (10000 = 100%)
            profile.totalEarnings,
            profile.currentStreak,
            profile.reputationScore
        );
    }

    function verifyUser(address user) external onlyOwner {
        require(profileExists[user], "Profile does not exist");
        profiles[user].isVerified = true;
        emit ProfileUpdated(user, "verified");
    }

    function isUsernameAvailable(string memory username) external view returns (bool) {
        return usernameToAddress[username] == address(0);
    }
}