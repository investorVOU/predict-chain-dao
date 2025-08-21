
# PredictChain 🔮

A decentralized prediction market platform built on blockchain technology, enabling users to create, participate in, and resolve prediction markets while earning NFT rewards and participating in DAO governance.

## 🌟 Features

### Core Functionality
- **Prediction Markets**: Create and participate in prediction markets on any topic
- **Smart Contract Integration**: Fully decentralized betting and resolution system
- **NFT Achievement System**: Earn unique NFTs for milestones and achievements
- **DAO Governance**: Community-driven platform governance with voting power
- **User Profiles**: Track prediction history, accuracy, and earnings
- **Real-time Updates**: Live market data and betting statistics

### Key Components
- **Market Creation**: Anyone can create prediction markets with custom end times
- **Betting System**: Place bets on Yes/No outcomes with ETH
- **Automated Resolution**: Market creators can resolve outcomes after events conclude
- **Reward Distribution**: Automatic payout calculation and distribution to winners
- **Platform Fees**: 2.5% platform fee on winnings for sustainability
- **Betting Cutoffs**: Betting automatically stops 1 hour before market end time

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Shadcn/ui** for UI components
- **Framer Motion** for animations
- **React Query** for data fetching
- **React Router** for navigation

### Blockchain & Web3
- **ThirdwebSDK** for Web3 integration
- **Solidity** smart contracts
- **Ethereum** blockchain (mainnet/testnet)
- **MetaMask** wallet integration

### Backend
- **Node.js** with Express
- **TypeScript** throughout
- **Drizzle ORM** with PostgreSQL
- **WebSocket** support for real-time updates

### Smart Contracts
- **PredictionMarket.sol**: Core betting and resolution logic
- **UserProfile.sol**: User data and statistics tracking
- **NFTReward.sol**: Achievement and milestone NFTs
- **DAO.sol**: Governance and voting mechanisms

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ 
- PostgreSQL database
- MetaMask or compatible Web3 wallet
- Ethereum testnet ETH for testing

### Installation

1. **Clone the repository**
   ```bash
   git clone https://your-repo-url.git
   cd predictchain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL=your_postgresql_connection_string
   
   # ThirdWeb Configuration
   VITE_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
   
   # Node Environment
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

### Deployment on Replit

1. **Import Project**: Import your repository to Replit
2. **Environment Variables**: Set up environment variables in Replit's Secrets tab
3. **Database**: Use Replit's PostgreSQL database or external database
4. **Deploy**: Use Replit's deployment feature for production

## 📊 Smart Contract Architecture

### PredictionMarket Contract
- Market creation and management
- Betting logic with position tracking
- Automated payout calculations
- Platform fee collection
- Market resolution system

### User Profile Contract
- Prediction history tracking
- Performance metrics
- Achievement triggers
- Statistics aggregation

### NFT Reward Contract
- Milestone-based NFT minting
- Achievement verification
- Voting power bonuses
- User activity tracking

### DAO Contract
- Governance proposal system
- Voting mechanisms
- Platform parameter updates
- Community decision making

## 🎮 How It Works

### For Users
1. **Connect Wallet**: Connect MetaMask or compatible wallet
2. **Browse Markets**: Explore active prediction markets
3. **Place Bets**: Bet ETH on Yes/No outcomes
4. **Earn Rewards**: Receive payouts for correct predictions
5. **Collect NFTs**: Earn achievement NFTs for milestones
6. **Participate in DAO**: Vote on platform governance

### For Market Creators
1. **Create Market**: Set title, description, category, and end time
2. **Monitor Activity**: Track betting volume and participation
3. **Resolve Market**: Choose correct outcome after event concludes
4. **Earn Fees**: Receive portion of platform fees (if applicable)

### Market Lifecycle
1. **Creation**: Market is created with future end time
2. **Active Betting**: Users can place bets until 1 hour before end time
3. **Event Period**: No betting allowed during actual event
4. **Resolution**: Creator resolves market with correct outcome
5. **Payout**: Winners automatically receive their share

## 🏆 NFT Achievement System

### Available Milestones
- **First Connection**: Connect wallet to platform
- **Fortune Teller**: Make your first prediction
- **Oracle**: Successfully predict an outcome
- **Crystal Ball Master**: Achieve top 10% accuracy
- **Community Builder**: Active platform contributor
- **Democracy Champion**: Participate in 5+ governance votes
- **Early Bird**: Among first 100 users
- **Streak Master**: 5+ successful predictions in a row
- **Big Winner**: Win 10+ ETH total
- **Diamond Hands**: Hold positions through volatility

### Benefits
- Unique collectible NFTs
- Voting power bonuses in DAO
- Social status and recognition
- Potential future utility

## 🗳 DAO Governance

### Voting Power
Base voting power + NFT bonuses from achievements

### Governance Areas
- Platform fee adjustments
- New feature proposals
- Market category additions
- Platform policy changes
- Treasury management

## 📈 Market Economics

### Betting Mechanics
- **Pari-mutuel betting**: Winners split the losing side's pool
- **Proportional payouts**: Based on bet size and odds
- **Platform fee**: 2.5% on winnings
- **Gas fees**: Standard Ethereum transaction costs

### Example Payout Calculation
```
Total Pool: 100 ETH
Yes Bets: 30 ETH
No Bets: 70 ETH
Correct Outcome: Yes
Platform Fee: 2.5%

Payout Pool = 100 ETH - (100 ETH * 0.025) = 97.5 ETH
User Bet: 5 ETH on Yes
User Share: (5 ETH / 30 ETH) * 97.5 ETH = 16.25 ETH
```

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run check        # TypeScript type checking
npm run db:push      # Push database schema changes

# Production
npm run build        # Build for production
npm start           # Start production server

# Database
npm run db:push      # Apply database migrations
```

## 🚨 Security Considerations

### Smart Contract Security
- Reentrancy protection
- Access control modifiers
- Input validation
- Safe math operations
- Emergency pause mechanisms

### Frontend Security
- Input sanitization
- XSS protection
- Secure wallet integration
- Environment variable protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed description
4. Join our community Discord (if applicable)

## 🔗 Links

- **Live Demo**: [Your Replit URL]
- **Documentation**: [Detailed docs link]
- **Community**: [Discord/Telegram link]
- **Twitter**: [Project Twitter]

## ⚠️ Disclaimer

This is experimental software. Use at your own risk. Only bet what you can afford to lose. Cryptocurrency markets are volatile and unpredictable.
