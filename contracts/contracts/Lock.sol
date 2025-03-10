// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract DonationPlatform {
    struct Campaign {
        uint256 id;
        string title;
        string description;
        uint256 goal;
        uint256 raised;
        address payable owner;
        bool isActive;
        address[] recipients;
        uint256 deadline;
        string image;
    }

    struct Donor {
        address donorAddress;
        uint256 amount;
        bytes32 txHash; // Add transaction hash for donations
    }

    struct Recipient {
        address recipientAddress;
        uint256 amount;
        bytes32 txHash; // Add transaction hash for disbursements
    }

    uint256 public campaignCount;
    mapping(uint256 => Campaign) public campaigns;
    mapping(address => uint256[]) public userCampaigns;
    mapping(uint256 => Donor[]) public campaignDonors;
    mapping(address => uint256[]) public userDonations;
    mapping(uint256 => Recipient[]) public campaignRecipients;

    event CampaignCreated(uint256 id, string title, string description, uint256 goal, address owner, uint256 deadline, string image);
     event DonationMade(uint256 campaignId, address donor, uint256 amount, bytes32 txHash); 
    event FundsDistributed(uint256 campaignId, address[] recipients, uint256[] amounts, bytes32[] txHashes); 

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _goal,
        address[] memory _recipients,
        uint256 _deadline,
        string memory _image
    ) public {
        require(_recipients.length > 0, "At least one recipient required");
        require(_deadline > block.timestamp, "Deadline must be in the future");

        campaignCount++;
        campaigns[campaignCount] = Campaign({
            id: campaignCount,
            title: _title,
            description: _description,
            goal: _goal,
            raised: 0,
            owner: payable(msg.sender),
            isActive: true,
            recipients: _recipients,
            deadline: _deadline,
            image: _image
        });
        userCampaigns[msg.sender].push(campaignCount);
        emit CampaignCreated(campaignCount, _title, _description, _goal, msg.sender, _deadline, _image);
    }

    function donate(uint256 _campaignId) public payable {
        require(_campaignId > 0 && _campaignId <= campaignCount, "Invalid campaign ID");
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.isActive, "Campaign is not active");

        campaign.raised += msg.value;

        // Get the transaction hash
        bytes32 txHash = blockhash(block.number - 1);

        // Store the donation with the transaction hash
        campaignDonors[_campaignId].push(Donor({
            donorAddress: msg.sender,
            amount: msg.value,
            txHash: txHash
        }));

        userDonations[msg.sender].push(_campaignId);

        emit DonationMade(_campaignId, msg.sender, msg.value, txHash);

        if (campaign.raised >= campaign.goal || block.timestamp >= campaign.deadline) {
            distributeFunds(_campaignId);
        }
    }

function distributeFunds(uint256 _campaignId) internal {
    Campaign storage campaign = campaigns[_campaignId];
    require(campaign.isActive, "Campaign is not active");
    require(campaign.raised >= campaign.goal || block.timestamp >= campaign.deadline, "Goal not reached or deadline not reached");

    campaign.isActive = false; // Mark campaign as inactive before distribution
    uint256 totalRaised = campaign.raised;
    uint256 recipientCount = campaign.recipients.length;

    uint256 amountPerRecipient = totalRaised / recipientCount;
    uint256 remainder = totalRaised % recipientCount;

    console.log("Contract balance:", address(this).balance);
    console.log("Total raised:", totalRaised);
    console.log("Recipient count:", recipientCount);

    uint256[] memory amounts = new uint256[](recipientCount);
    bytes32[] memory txHashes = new bytes32[](recipientCount); // Array to store transaction hashes

    for (uint256 i = 0; i < recipientCount; i++) {
        amounts[i] = amountPerRecipient;
        if (remainder > 0) {
            amounts[i]++;
            remainder--;
        }

       bytes32 txHash = blockhash(block.number - 1);

            // Store the recipient, amount, and transaction hash
            campaignRecipients[_campaignId].push(Recipient({
                recipientAddress: campaign.recipients[i],
                amount: amounts[i],
                txHash: txHash
            }));

            txHashes[i] = txHash; 

        console.log("Sending to recipient:", campaign.recipients[i]);
        console.log("Amount:", amounts[i]);

        // Send funds to the recipient
        (bool sent, ) = payable(campaign.recipients[i]).call{value: amounts[i]}("");
        require(sent, "Failed to send Ether to recipient");
    }

    emit FundsDistributed(_campaignId, campaign.recipients, amounts, txHashes);
}


    function getCampaign(uint256 _campaignId) public view returns (
        uint256 id,
        string memory title,
        string memory description,
        uint256 goal,
        uint256 raised,
        address owner,
        bool isActive,
        address[] memory recipients
    ) {
        Campaign memory campaign = campaigns[_campaignId];
        return (
            campaign.id,
            campaign.title,
            campaign.description,
            campaign.goal,
            campaign.raised,
            campaign.owner,
            campaign.isActive,
            campaign.recipients
        );
    }

    function getAllCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](campaignCount);
        for (uint256 i = 1; i <= campaignCount; i++) {
            allCampaigns[i - 1] = campaigns[i];
        }
        return allCampaigns;
    }

    function getUserCampaigns(address _user) public view returns (Campaign[] memory) {
        uint256[] memory userCampaignIds = userCampaigns[_user];
        Campaign[] memory userCampaignsData = new Campaign[](userCampaignIds.length);
        for (uint256 i = 0; i < userCampaignIds.length; i++) {
            userCampaignsData[i] = campaigns[userCampaignIds[i]];
        }
        return userCampaignsData;
    }

    // Get donors for a specific campaign
    function getCampaignDonors(uint256 _campaignId) public view returns (Donor[] memory) {
        return campaignDonors[_campaignId];
    }

    function getCampaignRecipients(uint256 _campaignId) public view returns (Recipient[] memory) {
    return campaignRecipients[_campaignId];
}

    // Get campaigns a user has donated to
    function getUserDonations(address _user) public view returns (Campaign[] memory) {
        uint256[] memory donatedCampaignIds = userDonations[_user];
        Campaign[] memory donatedCampaigns = new Campaign[](donatedCampaignIds.length);
        for (uint256 i = 0; i < donatedCampaignIds.length; i++) {
            donatedCampaigns[i] = campaigns[donatedCampaignIds[i]];
        }
        return donatedCampaigns;
    }
}