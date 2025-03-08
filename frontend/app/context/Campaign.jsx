"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import CampaignFactoryABI from "../abis/CampaignFactory.json";
import { useSession } from "next-auth/react";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [userCampaigns, setUserCampaigns] = useState([]);
  const [donors, setDonors] = useState([]);
  const [donatedCampaigns, setDonatedCampaigns] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const createNotification = async (type, message, data = {}) => {
    if (!session?.user?.accessToken) return;

    try {
      await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        }/api/notifications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.accessToken}`,
          },
          body: JSON.stringify({ type, message, data }),
        }
      );
    } catch (error) {
      console.error("Failed to create notification:", error);
    }
  };

  const connect = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this feature.");
      window.open("https://metamask.io/download/", "_blank");
      return;
    }
  
    setIsLoading(true);
    try {
      // First, get MetaMask accounts
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
  
      if (accounts.length === 0) {
        alert("No accounts found. Please unlock MetaMask and try again.");
        setIsLoading(false);
        return;
      }
  
      const metamaskAddress = accounts[0];
      
      // Only verify wallet address if user is logged in
      if (session?.user) {
        try {
          // Fetch the user's registered wallet address from the database
          const userResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.user.accessToken}`,
              },
            }
          );
  
          if (!userResponse.ok) {
            const errorText = await userResponse.text();
            console.error("Failed to fetch user data:", errorText);
            alert("Failed to verify wallet address. Please try again later.");
            setIsLoading(false);
            return;
          }
  
          const userData = await userResponse.json();
          const registeredAddress = userData.smartWalletAddress;
  
          // Compare addresses (case-insensitive)
          if (!registeredAddress) {
            alert(
              "No wallet address found in your profile. Please update your profile with a wallet address."
            );
            setIsLoading(false);
            return;
          }
  
          if (metamaskAddress.toLowerCase() !== registeredAddress.toLowerCase()) {
            alert(
              "Error: The connected MetaMask address doesn't match the wallet address you registered with. Please use the correct wallet."
            );
            setIsLoading(false);
            return;
          }
  
          console.log("Wallet address verified successfully:", metamaskAddress);
        } catch (error) {
          console.error("Error verifying wallet address:", error);
          alert("Failed to verify wallet address. Please try again later.");
          setIsLoading(false);
          return;
        }
      }
  
      // If we made it here, either the addresses match or the user isn't logged in
      setAddress(metamaskAddress);
  
      try {
        // Connect to the blockchain and set up the contract
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
  
        const contractInstance = new ethers.Contract(
          "0xcFbd89190Ca387fDee54e0dd59B0d10F7B159BfC",
          CampaignFactoryABI.abi,
          signer
        );
  
        setContract(contractInstance);
        
        // Fetch campaigns after successful connection
        await fetchCampaigns();
        
        console.log("Wallet connected successfully:", metamaskAddress);
      } catch (error) {
        console.error("Contract connection error:", error);
        alert("Failed to connect to the blockchain. Please try again later.");
        setAddress(null); // Reset address since connection failed
      }
    } catch (error) {
      console.error("Failed to connect to MetaMask:", error);
      alert("Failed to connect to MetaMask. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const contractAddress = "0xcFbd89190Ca387fDee54e0dd59B0d10F7B159BfC";

  const fetchDonors = async (campaignId) => {
    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        "0xcFbd89190Ca387fDee54e0dd59B0d10F7B159BfC",
        CampaignFactoryABI.abi,
        signer
      );
      setContract(contract);

      const donors = await contract.getCampaignDonors(campaignId);
      setDonors(donors);
    } catch (error) {
      console.error("Failed to fetch donors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecipients = async (campaignId) => {
    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        "0xcFbd89190Ca387fDee54e0dd59B0d10F7B159BfC",
        CampaignFactoryABI.abi,
        signer
      );
      setContract(contract);

      const recipients = await contract.getCampaignRecipients(campaignId);
      setRecipients(recipients);
    } catch (error) {
      console.error("Failed to fetch recipients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        "0xcFbd89190Ca387fDee54e0dd59B0d10F7B159BfC",
        CampaignFactoryABI.abi,
        signer
      );

      const campaigns = await contract.getAllCampaigns();
      setCampaigns(campaigns);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setAddress(accounts[0]);
      } else {
        setAddress(null);
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (campaigns.length > 0 && session?.user) {
      checkCampaignDeadlines();

      const deadlineInterval = setInterval(() => {
        checkCampaignDeadlines();
      }, 6 * 60 * 60 * 1000);

      return () => {
        clearInterval(deadlineInterval);
      };
    }
  }, [campaigns, session]);

  const getUserCampaigns = async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        "0xcFbd89190Ca387fDee54e0dd59B0d10F7B159BfC",
        CampaignFactoryABI.abi,
        signer
      );

      const userCampaignsList = await contract.getUserCampaigns(address);
      console.log("User campaigns fetched:", userCampaignsList);

      setUserCampaigns(userCampaignsList || []);

      return userCampaignsList;
    } catch (error) {
      console.error("Failed to fetch user campaigns:", error);
      setUserCampaigns([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createCampaign = async (form) => {
    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        "0xcFbd89190Ca387fDee54e0dd59B0d10F7B159BfC",
        CampaignFactoryABI.abi,
        signer
      );

      const deadline = new Date(form.deadline).getTime();
      const goal = form.target;
      const recipients = form.recipients;

      const transaction = await contract.createCampaign(
        form.title,
        form.description,
        goal,
        recipients,
        deadline,
        form.image,
        {
          gasLimit: 9999000,
        }
      );

      await transaction.wait();

      console.log("Campaign created successfully:", transaction);

      if (session?.user) {
        await createNotification(
          "CAMPAIGN_CREATED",
          `Your campaign "${form.title}" has been created successfully!`,
          { campaignTitle: form.title, campaignId: transaction.hash }
        );
      }

      await fetchCampaigns();
    } catch (error) {
      console.error("Contract error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const campaignsDonatedTo = async (waddress) => {
    if (!waddress) return;

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        "0xcFbd89190Ca387fDee54e0dd59B0d10F7B159BfC",
        CampaignFactoryABI.abi,
        signer
      );

      const userCampaignsList = await contract.getUserDonations(waddress);
      console.log("User's donated campaigns fetched:", userCampaignsList);

      setDonatedCampaigns(userCampaignsList || []);

      return userCampaignsList;
    } catch (error) {
      console.error("Failed to fetch user donated campaigns:", error);
      setDonatedCampaigns([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const donate = async (campaignId, donationAmount) => {
    if (!address) {
      alert("Please connect your wallet to donate.");
      return;
    }

    if (!campaignId || donationAmount <= 0) {
      alert("Invalid campaign ID or donation amount.");
      return;
    }

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        "0xcFbd89190Ca387fDee54e0dd59B0d10F7B159BfC",
        CampaignFactoryABI.abi,
        signer
      );

      const donationAmountWei = ethers.parseEther(donationAmount.toString());

      const campaign = campaigns.find((c) => c.id == campaignId);
      const campaignTitle = campaign
        ? campaign.title
        : "Campaign #" + campaignId;

      const transaction = await contract.donate(campaignId, {
        value: donationAmountWei,
      });

      await transaction.wait();

      console.log("Donation successful:", transaction);

      if (session?.user) {
        await createNotification(
          "DONATION",
          `You donated ${donationAmount} ETH to campaign "${campaignTitle}"`,
          { campaignId, campaignTitle, amount: donationAmount }
        );
      }

      try {
        const ownerResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/address/${campaign.owner}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (ownerResponse.ok) {
          const ownerData = await ownerResponse.json();
          console.log("Campaign owner data:", ownerData);

          if (session?.accessToken) {
            const notificationResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/notifications`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session.accessToken}`,
                },
                body: JSON.stringify({
                  userId: ownerData.id,
                  type: "DONATION_RECEIVED",
                  message: `Someone donated ${donationAmount} ETH to your campaign "${campaignTitle}"`,
                  data: { campaignId, campaignTitle, amount: donationAmount },
                }),
              }
            );

            if (!notificationResponse.ok) {
              console.error(
                "Failed to create owner notification:",
                await notificationResponse.text()
              );
            } else {
              console.log("Notification sent to campaign owner successfully");
            }
          } else {
            console.log("No user session, skipping notification creation");
          }
        } else {
          console.error(
            "Could not fetch campaign owner data:",
            await ownerResponse.text()
          );
        }
      } catch (error) {
        console.error("Error in owner notification process:", error);
      }

      await checkCampaignMilestone(
        campaign,
        campaignTitle,
        campaignId,
        donationAmountWei
      );

      await fetchCampaigns();
    } catch (error) {
      console.error("Failed to donate:", error);
      alert("Failed to donate. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkCampaignDeadlines = async () => {
    try {
      if (!campaigns || !campaigns.length || !session?.user) return;

      const now = Date.now();

      for (const campaign of campaigns) {
        if (!campaign.isActive) continue;

        const deadline = Number(campaign.deadline) * 1000;

        if (
          deadline <= now + 24 * 60 * 60 * 1000 &&
          deadline > now - 24 * 60 * 60 * 1000
        ) {
          try {
            const ownerResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/users/address/${campaign.owner}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session?.accessToken}`,
                },
              }
            );

            if (ownerResponse.ok) {
              const ownerData = await ownerResponse.json();

              await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/notifications`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                  },
                  body: JSON.stringify({
                    userId: ownerData.id,
                    type: "CAMPAIGN_DEADLINE",
                    message:
                      deadline <= now
                        ? `Your campaign "${campaign.title}" has reached its deadline.`
                        : `Your campaign "${campaign.title}" will reach its deadline within 24 hours.`,
                    data: {
                      campaignId: campaign.id,
                      campaignTitle: campaign.title,
                      deadlineReached: deadline <= now,
                    },
                  }),
                }
              );
            }
          } catch (error) {
            console.error(
              `Failed to send deadline notification for campaign ${campaign.id}:`,
              error
            );
          }
        }
      }
    } catch (error) {
      console.error("Failed to check campaign deadlines:", error);
    }
  };

  const checkCampaignMilestone = async (
    campaign,
    campaignTitle,
    campaignId,
    donationAmountWei
  ) => {
    try {
      const goalWei = ethers.parseEther(campaign.goal.toString());
      const raisedWithNewDonation =
        ethers.parseEther(campaign.raised.toString()) + donationAmountWei;
      const progressPercentage = Number(
        (raisedWithNewDonation * BigInt(100)) / goalWei
      );

      const milestones = [25, 50, 75, 100];

      for (const milestone of milestones) {
        const previousProgress = Number(
          (ethers.parseEther(campaign.raised.toString()) * BigInt(100)) /
            goalWei
        );

        if (progressPercentage >= milestone && previousProgress < milestone) {
          const ownerResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/address/${campaign.owner}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (ownerResponse.ok) {
            const ownerData = await ownerResponse.json();
            await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/notifications`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify({
                  userId: ownerData.id,
                  type: "CAMPAIGN_MILESTONE",
                  message: `Your campaign "${campaignTitle}" has reached ${milestone}% of its goal!`,
                  data: { campaignId, campaignTitle, milestone },
                }),
              }
            );
          }

          if (milestone === 100) {
            await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/notifications`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify({
                  userId: ownerData.id,
                  type: "CAMPAIGN_COMPLETE",
                  message: `Congratulations! Your campaign "${campaignTitle}" has been fully funded!`,
                  data: { campaignId, campaignTitle },
                }),
              }
            );
          }
        }
      }
    } catch (error) {
      console.error("Failed to check campaign milestone:", error);
    }
  };

  return (
    <StateContext.Provider
      value={{
        address,
        connect,
        campaigns,
        fetchCampaigns,
        getUserCampaigns,
        userCampaigns,
        createCampaign,
        donate,
        donors,
        fetchDonors,
        recipients,
        fetchRecipients,
        donatedCampaigns,
        campaignsDonatedTo,
        contractAddress,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
