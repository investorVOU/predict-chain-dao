// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@thirdweb-dev/contracts/base/ERC20Base.sol";
import "./UserProfile.sol";
import "./NFTReward.sol";
import "./DAO.sol";

contract PredictionMarketFactory {
    event MarketCreated(address indexed marketAddress, string title, address indexed creator, uint256 endTime);
    
    mapping(address => address[]) public userMarkets;
    address[] public allMarkets;
    
    UserProfile public userProfileContract;
    NFTReward public nftRewardContract;
    DAO public daoContract;
    
    constructor(address _userProfile, address _nftReward, address _dao) {
        userProfileContract = UserProfile(_userProfile);
        nftRewardContract = NFTReward(_nftReward);
        daoContract = DAO(_dao);
    }
    
    function createMarket(
        string memory _title,
        string memory _description,
        string memory _category,
        uint256 _endTime
    ) external returns (address) {
        require(_endTime > block.timestamp, "End time must be in the future");
        
        uint256 marketId = allMarkets.length + 1;
        
        PredictionMarket newMarket = new PredictionMarket(
            _title,
            _description,
            _category,
            _endTime,
            marketId,
            msg.sender,
            address(userProfileContract),
            address(nftRewardContract),
            address(daoContract)
        );
        
        address marketAddress = address(newMarket);
        userMarkets[msg.sender].push(marketAddress);
        allMarkets.push(marketAddress);
        
        emit MarketCreated(marketAddress, _title, msg.sender, _endTime);
        return marketAddress;
    }
    
    function getUserMarkets(address user) external view returns (address[] memory) {
        return userMarkets[user];
    }
    
    function getAllMarkets() external view returns (address[] memory) {
        return allMarkets;
    }
    
    function getMarketCount() external view returns (uint256) {
        return allMarkets.length;
    }
}

contract PredictionMarket {
    enum MarketStatus { Active, Resolved, Cancelled }
    enum Position { Yes, No }
    
    struct Bet {
        address user;
        Position position;
        uint256 amount;
        uint256 timestamp;
        bool claimed;
        uint256 betId;
    }
    
    string public title;
    string public description;
    string public category;
    uint256 public endTime;
    uint256 public marketId;
    address public creator;
    address public resolver;
    MarketStatus public status;
    Position public result;
    
    uint256 public totalYesAmount;
    uint256 public totalNoAmount;
    uint256 public totalAmount;
    uint256 public betCounter;
    
    mapping(address => Bet[]) public userBets;
    mapping(address => uint256) public userYesAmount;
    mapping(address => uint256) public userNoAmount;
    Bet[] public allBets;
    
    UserProfile public userProfileContract;
    NFTReward public nftRewardContract;
    DAO public daoContract;
    
    uint256 public constant PLATFORM_FEE = 250; // 2.5%
    uint256 public constant FEE_DENOMINATOR = 10000;
    address public platformOwner;
    uint256 public collectedFees;
    
    event BetPlaced(address indexed user, Position position, uint256 amount);
    event MarketResolved(Position result);
    event WinningsClaimed(address indexed user, uint256 amount);
    event MarketCancelled();
    event FeesWithdrawn(address indexed owner, uint256 amount);
    
    modifier onlyCreator() {
        require(msg.sender == creator, "Only creator can call this");
        _;
    }
    
    modifier onlyPlatformOwner() {
        require(msg.sender == platformOwner, "Only platform owner can call this");
        _;
    }
    
    modifier onlyActive() {
        require(status == MarketStatus.Active, "Market not active");
        require(block.timestamp < endTime, "Market has ended");
        _;
    }
    
    modifier onlyResolved() {
        require(status == MarketStatus.Resolved, "Market not resolved");
        _;
    }
    
    constructor(
        string memory _title,
        string memory _description,
        string memory _category,
        uint256 _endTime,
        uint256 _marketId,
        address _creator,
        address _userProfile,
        address _nftReward,
        address _dao
    ) {
        title = _title;
        description = _description;
        category = _category;
        endTime = _endTime;
        marketId = _marketId;
        creator = _creator;
        resolver = _creator;
        status = MarketStatus.Active;
        platformOwner = _creator; // Creator becomes platform owner initially
        userProfileContract = UserProfile(_userProfile);
        nftRewardContract = NFTReward(_nftReward);
        daoContract = DAO(_dao);
    }
    
    function placeBet(Position _position) external payable onlyActive {
        require(msg.value > 0, "Bet amount must be greater than 0");
        
        betCounter++;
        Bet memory newBet = Bet({
            user: msg.sender,
            position: _position,
            amount: msg.value,
            timestamp: block.timestamp,
            claimed: false,
            betId: betCounter
        });
        
        userBets[msg.sender].push(newBet);
        allBets.push(newBet);
        
        if (_position == Position.Yes) {
            totalYesAmount += msg.value;
            userYesAmount[msg.sender] += msg.value;
        } else {
            totalNoAmount += msg.value;
            userNoAmount[msg.sender] += msg.value;
        }
        
        totalAmount += msg.value;
        
        // Record prediction in user profile and update activities for NFT rewards
        if (address(userProfileContract) != address(0)) {
            string memory positionStr = _position == Position.Yes ? "yes" : "no";
            userProfileContract.recordPrediction(msg.sender, marketId, betCounter, positionStr, msg.value);
        }
        
        // Update user activity for NFT milestones
        if (address(nftRewardContract) != address(0)) {
            // Check if this is user's first bet to award first prediction milestone
            if (userBets[msg.sender].length == 1) {
                try nftRewardContract.checkAndAwardMilestones(msg.sender) {} catch {}
            }
            
            // Update prediction count for milestone tracking
            uint256 currentPredictions = userBets[msg.sender].length;
            try nftRewardContract.updateUserActivity(
                msg.sender,
                currentPredictions, // predictions
                0, // successful predictions (updated on resolution)
                0, // winnings (updated on claim)
                0, // governance votes
                0  // streak (updated on resolution)
            ) {} catch {}
        }
        
        emit BetPlaced(msg.sender, _position, msg.value);
    }
    
    function resolveMarket(Position _result) external onlyCreator {
        require(status == MarketStatus.Active, "Market already resolved/cancelled");
        require(block.timestamp >= endTime, "Market hasn't ended yet");
        
        status = MarketStatus.Resolved;
        result = _result;
        
        // Update user profiles with prediction results
        if (address(userProfileContract) != address(0)) {
            _updateUserProfiles(_result);
        }
        
        emit MarketResolved(_result);
    }
    
    function _updateUserProfiles(Position _result) internal {
        for (uint256 i = 0; i < allBets.length; i++) {
            Bet memory bet = allBets[i];
            bool won = (bet.position == _result);
            uint256 payout = won ? calculateWinnings(bet.user) : 0;
            
            userProfileContract.recordPredictionResult(bet.user, marketId, won, payout);
        }
    }
    
    function cancelMarket() external onlyCreator {
        require(status == MarketStatus.Active, "Market already resolved/cancelled");
        
        status = MarketStatus.Cancelled;
        
        emit MarketCancelled();
    }
    
    function claimWinnings() external onlyResolved {
        require(!hasClaimed(msg.sender), "Winnings already claimed");
        
        uint256 winnings = calculateWinnings(msg.sender);
        require(winnings > 0, "No winnings to claim");
        
        // Calculate platform fee
        uint256 platformFee = (winnings * PLATFORM_FEE) / FEE_DENOMINATOR;
        uint256 userWinnings = winnings - platformFee;
        
        // Add to collected fees
        collectedFees += platformFee;
        
        // Mark all user's bets as claimed
        for (uint i = 0; i < userBets[msg.sender].length; i++) {
            userBets[msg.sender][i].claimed = true;
        }
        
        // Update NFT reward milestones for successful prediction and winnings
        if (address(nftRewardContract) != address(0)) {
            uint256 successfulPredictions = 0;
            
            // Count successful predictions for this user
            for (uint i = 0; i < userBets[msg.sender].length; i++) {
                if (userBets[msg.sender][i].position == result) {
                    successfulPredictions++;
                }
            }
            
            try nftRewardContract.updateUserActivity(
                msg.sender,
                userBets[msg.sender].length, // total predictions
                successfulPredictions, // successful predictions
                userWinnings, // total winnings
                0, // governance votes (unchanged)
                0  // streak (could be calculated)
            ) {} catch {}
        }
        
        // Transfer winnings
        payable(msg.sender).transfer(userWinnings);
        
        emit WinningsClaimed(msg.sender, userWinnings);
    }
    
    function claimRefund() external {
        require(status == MarketStatus.Cancelled, "Market not cancelled");
        require(!hasClaimed(msg.sender), "Refund already claimed");
        
        uint256 refundAmount = userYesAmount[msg.sender] + userNoAmount[msg.sender];
        require(refundAmount > 0, "No refund available");
        
        // Mark all user's bets as claimed
        for (uint i = 0; i < userBets[msg.sender].length; i++) {
            userBets[msg.sender][i].claimed = true;
        }
        
        payable(msg.sender).transfer(refundAmount);
        
        emit WinningsClaimed(msg.sender, refundAmount);
    }
    
    function calculateWinnings(address user) public view returns (uint256) {
        if (status != MarketStatus.Resolved) return 0;
        if (hasClaimed(user)) return 0;
        
        uint256 userWinningAmount;
        uint256 totalWinningAmount;
        
        if (result == Position.Yes) {
            userWinningAmount = userYesAmount[user];
            totalWinningAmount = totalYesAmount;
        } else {
            userWinningAmount = userNoAmount[user];
            totalWinningAmount = totalNoAmount;
        }
        
        if (userWinningAmount == 0 || totalWinningAmount == 0) return 0;
        
        // Calculate platform fee
        uint256 platformFee = (totalAmount * PLATFORM_FEE) / FEE_DENOMINATOR;
        uint256 totalWinningsPool = totalAmount - platformFee;
        
        // User's share of the winnings pool proportional to their winning bet
        uint256 userShare = (userWinningAmount * totalWinningsPool) / totalWinningAmount;
        
        return userShare;
    }
    
    function hasClaimed(address user) public view returns (bool) {
        Bet[] memory bets = userBets[user];
        if (bets.length == 0) return false;
        
        // Check if any bet is not claimed
        for (uint i = 0; i < bets.length; i++) {
            if (!bets[i].claimed) return false;
        }
        return true;
    }
    
    function getUserBets(address user) external view returns (Bet[] memory) {
        return userBets[user];
    }
    
    function getMarketInfo() external view returns (
        string memory _title,
        string memory _description,
        uint256 _endTime,
        address _creator,
        MarketStatus _status,
        uint256 _totalAmount,
        uint256 _totalYesAmount,
        uint256 _totalNoAmount
    ) {
        return (
            title,
            description,
            endTime,
            creator,
            status,
            totalAmount,
            totalYesAmount,
            totalNoAmount
        );
    }
    
    function getYesPercentage() external view returns (uint256) {
        if (totalAmount == 0) return 50; // Default to 50% if no bets
        return (totalYesAmount * 100) / totalAmount;
    }
    
    function getNoPercentage() external view returns (uint256) {
        if (totalAmount == 0) return 50; // Default to 50% if no bets
        return (totalNoAmount * 100) / totalAmount;
    }
    
    function withdrawFees() external onlyPlatformOwner {
        require(collectedFees > 0, "No fees to withdraw");
        
        uint256 amount = collectedFees;
        collectedFees = 0;
        
        payable(platformOwner).transfer(amount);
        
        emit FeesWithdrawn(platformOwner, amount);
    }
    
    function updatePlatformOwner(address newOwner) external onlyPlatformOwner {
        require(newOwner != address(0), "Invalid owner address");
        platformOwner = newOwner;
    }
    
    function getPlatformStats() external view returns (uint256 totalFees, uint256 contractBalance, address owner) {
        return (collectedFees, address(this).balance, platformOwner);
    }
    
    receive() external payable {
        revert("Direct payments not accepted. Use placeBet function.");
    }
}