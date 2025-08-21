// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DAO is Ownable, ReentrancyGuard {
    struct Proposal {
        uint256 id;
        string title;
        string description;
        address proposer;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 endTime;
        bool executed;
        bool approved;
        ProposalType proposalType;
        address targetContract;
        bytes callData;
    }

    enum ProposalType {
        PLATFORM_UPGRADE,
        MARKET_APPROVAL,
        PARAMETER_CHANGE,
        TREASURY_ALLOCATION
    }

    enum VoteChoice {
        FOR,
        AGAINST,
        ABSTAIN
    }

    uint256 public proposalCounter;
    uint256 public votingPeriod = 7 days;
    uint256 public proposalThreshold = 1000 * 10**18; // 1000 tokens minimum to propose
    uint256 public quorumThreshold = 10000 * 10**18; // 10,000 tokens minimum for quorum

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => VoteChoice)) public votes;
    mapping(address => uint256) public votingPower; // Based on staked tokens + NFT multipliers

    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        ProposalType proposalType,
        uint256 endTime
    );

    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        VoteChoice choice,
        uint256 votingPower
    );

    event ProposalExecuted(uint256 indexed proposalId, bool approved);

    modifier validProposal(uint256 proposalId) {
        require(proposalId <= proposalCounter, "Invalid proposal ID");
        require(proposals[proposalId].id != 0, "Proposal does not exist");
        _;
    }

    constructor() {}

    function createProposal(
        string memory title,
        string memory description,
        ProposalType proposalType,
        address targetContract,
        bytes memory callData
    ) external returns (uint256) {
        require(votingPower[msg.sender] >= proposalThreshold, "Insufficient voting power to propose");
        
        proposalCounter++;
        uint256 endTime = block.timestamp + votingPeriod;

        proposals[proposalCounter] = Proposal({
            id: proposalCounter,
            title: title,
            description: description,
            proposer: msg.sender,
            votesFor: 0,
            votesAgainst: 0,
            endTime: endTime,
            executed: false,
            approved: false,
            proposalType: proposalType,
            targetContract: targetContract,
            callData: callData
        });

        emit ProposalCreated(proposalCounter, msg.sender, title, proposalType, endTime);
        return proposalCounter;
    }

    function vote(uint256 proposalId, VoteChoice choice) external validProposal(proposalId) {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp < proposal.endTime, "Voting period has ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        require(votingPower[msg.sender] > 0, "No voting power");

        hasVoted[proposalId][msg.sender] = true;
        votes[proposalId][msg.sender] = choice;

        uint256 voterPower = votingPower[msg.sender];

        if (choice == VoteChoice.FOR) {
            proposal.votesFor += voterPower;
        } else if (choice == VoteChoice.AGAINST) {
            proposal.votesAgainst += voterPower;
        }

        emit VoteCast(proposalId, msg.sender, choice, voterPower);
    }

    function executeProposal(uint256 proposalId) external validProposal(proposalId) nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp >= proposal.endTime, "Voting period not ended");
        require(!proposal.executed, "Proposal already executed");

        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst;
        require(totalVotes >= quorumThreshold, "Quorum not met");

        proposal.executed = true;
        proposal.approved = proposal.votesFor > proposal.votesAgainst;

        if (proposal.approved && proposal.targetContract != address(0)) {
            // Execute the proposal action
            (bool success, ) = proposal.targetContract.call(proposal.callData);
            require(success, "Proposal execution failed");
        }

        emit ProposalExecuted(proposalId, proposal.approved);
    }

    function updateVotingPower(address user, uint256 newPower) external onlyOwner {
        votingPower[user] = newPower;
    }

    function getProposal(uint256 proposalId) external view validProposal(proposalId) returns (Proposal memory) {
        return proposals[proposalId];
    }

    function getActiveProposals() external view returns (uint256[] memory) {
        uint256 activeCount = 0;
        
        // Count active proposals
        for (uint256 i = 1; i <= proposalCounter; i++) {
            if (block.timestamp < proposals[i].endTime && !proposals[i].executed) {
                activeCount++;
            }
        }

        uint256[] memory activeProposals = new uint256[](activeCount);
        uint256 index = 0;

        // Populate active proposals
        for (uint256 i = 1; i <= proposalCounter; i++) {
            if (block.timestamp < proposals[i].endTime && !proposals[i].executed) {
                activeProposals[index] = i;
                index++;
            }
        }

        return activeProposals;
    }

    function updateVotingPeriod(uint256 newPeriod) external onlyOwner {
        require(newPeriod >= 1 days && newPeriod <= 30 days, "Invalid voting period");
        votingPeriod = newPeriod;
    }

    function updateProposalThreshold(uint256 newThreshold) external onlyOwner {
        proposalThreshold = newThreshold;
    }

    function updateQuorumThreshold(uint256 newThreshold) external onlyOwner {
        quorumThreshold = newThreshold;
    }
}