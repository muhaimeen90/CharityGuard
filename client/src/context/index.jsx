import React, { useContext, createContext, useState, useEffect } from "react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([]); // Local state for campaigns
  const [donations, setDonations] = useState([]); // Local state for donations
  const [address, setAddress] = useState(null); // User's wallet address
  const [provider, setProvider] = useState(null); // Ethers provider

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== "undefined";
  };

  // Connect to MetaMask
  const connectToMetaMask = async () => {
    if (!isMetaMaskInstalled()) {
      alert(
        "MetaMask is not installed. Please install MetaMask to use this app."
      );
      return;
    }

    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setAddress(address);

      console.log("Connected to MetaMask with address:", address);
    } catch (error) {
      console.error("Failed to connect to MetaMask:", error);
      alert("Failed to connect to MetaMask. Please try again.");
    }
  };

  // Publish a new campaign
  const publishCampaign = async (form) => {
    if (!address) {
      alert("Please connect to MetaMask before creating a campaign.");
      return;
    }

    try {
      const newCampaign = {
        owner: address,
        title: form.title,
        description: form.description,
        target: form.target,
        deadline: new Date(form.deadline).getTime(),
        amountCollected: "0", // Initialize with 0
        image: form.image,
        pId: campaigns.length, // Assign a unique ID based on the current number of campaigns
      };

      setCampaigns([...campaigns, newCampaign]);
      console.log("Campaign created successfully", newCampaign);
    } catch (error) {
      console.log("Failed to create campaign", error);
    }
  };

  // Get all campaigns
  const getCampaigns = async () => {
    return campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: campaign.target,
      deadline: campaign.deadline,
      amountCollected: campaign.amountCollected,
      image: campaign.image,
      pId: i,
    }));
  };

  // Get campaigns created by the current user
  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();
    return allCampaigns.filter((campaign) => campaign.owner === address);
  };

  // Donate to a campaign
  const donate = async (pId, amount) => {
    if (!address) {
      alert("Please connect to MetaMask before donating.");
      return;
    }

    try {
      const updatedCampaigns = campaigns.map((campaign, index) => {
        if (index === pId) {
          return {
            ...campaign,
            amountCollected: (
              parseFloat(campaign.amountCollected) + parseFloat(amount)
            ).toString(),
          };
        }
        return campaign;
      });

      setCampaigns(updatedCampaigns);

      const newDonation = {
        pId,
        donator: address,
        donation: amount,
      };

      setDonations([...donations, newDonation]);
      console.log("Donation successful", newDonation);
    } catch (error) {
      console.log("Failed to donate", error);
    }
  };

  // Get donations for a specific campaign
  const getDonations = async (pId) => {
    const campaignDonations = donations.filter(
      (donation) => donation.pId === pId
    );
    return campaignDonations.map((donation) => ({
      donator: donation.donator,
      donation: donation.donation,
    }));
  };

  return (
    <StateContext.Provider
      value={{
        address,
        connect: connectToMetaMask, // Connect to MetaMask
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
