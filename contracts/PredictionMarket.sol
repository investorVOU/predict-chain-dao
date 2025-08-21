// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@thirdweb-dev/contracts/base/ERC20Base.sol";

contract PredictionMarketFactory {
    event MarketCreated(address indexed marketAddress, string title, address indexed creator, uint256 endTime);
    
    mapping(address => address[]) public userMarkets;
    address[] public allMarkets;
    
    function createMarket(
        string memory _title,
        string memory _description,
        uint256 _endTime
    ) external returns (address) {
        require(_endTime > block.timestamp, "End time must be in the future");
        
        PredictionMarket newMarket = new PredictionMarket(
            _title,
            _description,
            _endTime,
            msg.sender
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
    }
    
    string public title;
    string public description;
    uint256 public endTime;
    address public creator;
    address public resolver;
    MarketStatus public status;
    Position public result;
    
    uint256 public totalYesAmount;
    uint256 public totalNoAmount;
    uint256 public totalAmount;
    
    mapping(address => Bet[]) public userBets;
    mapping(address => uint256) public userYesAmount;
    mapping(address => uint256) public userNoAmount;
    Bet[] public allBets;
    
    uint256 public constant PLATFORM_FEE = 250; // 2.5%
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    event BetPlaced(address indexed user, Position position, uint256 amount);
    event MarketResolved(Position result);
    event WinningsClaimed(address indexed user, uint256 amount);
    event MarketCancelled();
    
    modifier onlyCreator() {
        require(msg.sender == creator, "Only creator can call this");
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
        uint256 _endTime,
        address _creator
    ) {
        title = _title;
        description = _description;
        endTime = _endTime;
        creator = _creator;
        resolver = _creator;
        status = MarketStatus.Active;
    }
    
    function placeBet(Position _position) external payable onlyActive {
        require(msg.value > 0, "Bet amount must be greater than 0");
        
        Bet memory newBet = Bet({
            user: msg.sender,
            position: _position,
            amount: msg.value,
            timestamp: block.timestamp,
            claimed: false
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
        
        emit BetPlaced(msg.sender, _position, msg.value);
    }
    
    function resolveMarket(Position _result) external onlyCreator {
        require(status == MarketStatus.Active, "Market already resolved/cancelled");
        require(block.timestamp >= endTime, "Market hasn't ended yet");
        
        status = MarketStatus.Resolved;
        result = _result;
        
        emit MarketResolved(_result);
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
        
        // Mark all user's bets as claimed
        for (uint i = 0; i < userBets[msg.sender].length; i++) {
            userBets[msg.sender][i].claimed = true;
        }
        
        // Transfer winnings
        payable(msg.sender).transfer(winnings);
        
        emit WinningsClaimed(msg.sender, winnings);
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
    
    // Withdraw platform fees (only callable by contract deployer)
    function withdrawPlatformFees() external {
        require(status == MarketStatus.Resolved, "Market not resolved");
        
        uint256 platformFee = (totalAmount * PLATFORM_FEE) / FEE_DENOMINATOR;
        if (platformFee > 0) {
            payable(creator).transfer(platformFee);
        }
    }
    
    receive() external payable {
        revert("Direct payments not accepted. Use placeBet function.");
    }
}