import { useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";

// Contract addresses - these would be deployed contract addresses
const PREDICTION_MARKET_FACTORY_ADDRESS = "0x..."; // To be replaced with actual deployed address
const DAO_ADDRESS = "0x..."; // To be replaced with actual deployed address
const NFT_REWARD_ADDRESS = "0x..."; // To be replaced with actual deployed address
const USER_PROFILE_ADDRESS = "0x..."; // To be replaced with actual deployed address

// Hook for PredictionMarketFactory contract
export function usePredictionMarketFactory() {
  const { contract } = useContract(PREDICTION_MARKET_FACTORY_ADDRESS);

  const { mutateAsync: createMarket } = useContractWrite(contract, "createMarket");
  const { data: allMarkets } = useContractRead(contract, "getAllMarkets");
  const { data: marketCount } = useContractRead(contract, "getMarketCount");

  return {
    contract,
    createMarket,
    allMarkets,
    marketCount
  };
}

// Hook for DAO contract
export function useDAO() {
  const { contract } = useContract(DAO_ADDRESS);

  const { mutateAsync: createProposal } = useContractWrite(contract, "createProposal");
  const { mutateAsync: vote } = useContractWrite(contract, "vote");
  const { mutateAsync: executeProposal } = useContractWrite(contract, "executeProposal");
  const { data: activeProposals } = useContractRead(contract, "getActiveProposals");
  const { data: proposalCounter } = useContractRead(contract, "proposalCounter");

  return {
    contract,
    createProposal,
    vote,
    executeProposal,
    activeProposals,
    proposalCounter
  };
}

// Hook for NFTReward contract
export function useNFTRewards() {
  const { contract } = useContract(NFT_REWARD_ADDRESS);

  const { mutateAsync: awardMilestone } = useContractWrite(contract, "awardMilestone");
  const { mutateAsync: checkAndAwardMilestones } = useContractWrite(contract, "checkAndAwardMilestones");
  const { data: totalSupply } = useContractRead(contract, "totalSupply");

  return {
    contract,
    awardMilestone,
    checkAndAwardMilestones,
    totalSupply
  };
}

// Hook for UserProfile contract
export function useUserProfile() {
  const { contract } = useContract(USER_PROFILE_ADDRESS);

  const { mutateAsync: createProfile } = useContractWrite(contract, "createProfile");
  const { mutateAsync: updateProfile } = useContractWrite(contract, "updateProfile");

  return {
    contract,
    createProfile,
    updateProfile
  };
}

// Hook for individual PredictionMarket contracts
export function usePredictionMarket(marketAddress: string) {
  const { contract } = useContract(marketAddress);

  const { mutateAsync: placeBet } = useContractWrite(contract, "placeBet");
  const { mutateAsync: resolveMarket } = useContractWrite(contract, "resolveMarket");
  const { mutateAsync: claimWinnings } = useContractWrite(contract, "claimWinnings");
  const { mutateAsync: claimRefund } = useContractWrite(contract, "claimRefund");
  const { data: isBettingActive } = useContractRead(contract, "isBettingActive");
  const { data: getTimeUntilBettingEnds } = useContractRead(contract, "getTimeUntilBettingEnds");

  const { data: title } = useContractRead(contract, "title");
  const { data: description } = useContractRead(contract, "description");
  const { data: category } = useContractRead(contract, "category");
  const { data: endTime } = useContractRead(contract, "endTime");
  const { data: status } = useContractRead(contract, "status");
  const { data: totalAmount } = useContractRead(contract, "totalAmount");
  const { data: totalYesAmount } = useContractRead(contract, "totalYesAmount");
  const { data: totalNoAmount } = useContractRead(contract, "totalNoAmount");

  return {
    contract,
    placeBet,
    resolveMarket,
    claimWinnings,
    claimRefund,
    isBettingActive,
    getTimeUntilBettingEnds,
    title,
    description,
    category,
    endTime,
    status,
    totalAmount,
    totalYesAmount,
    totalNoAmount
  };
}

// Hook for reading user-specific contract data
export function useUserContractData(userAddress: string) {
  const userProfileContract = useContract(USER_PROFILE_ADDRESS);
  const nftRewardContract = useContract(NFT_REWARD_ADDRESS);
  const daoContract = useContract(DAO_ADDRESS);

  const { data: userProfile } = useContractRead(userProfileContract.contract, "getProfile", [userAddress]);
  const { data: userStats } = useContractRead(userProfileContract.contract, "getUserStats", [userAddress]);
  const { data: userMilestones } = useContractRead(nftRewardContract.contract, "getUserMilestones", [userAddress]);
  const { data: votingPower } = useContractRead(daoContract.contract, "votingPower", [userAddress]);

  return {
    userProfile,
    userStats,
    userMilestones,
    votingPower
  };
}