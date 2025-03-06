// "use client";

// import React, { createContext, useContext, useState, useEffect } from "react";
// import { ethers } from "ethers";
// import CampaignFactoryABI from "../abis/CampaignFactory.json";
// import { useSession } from "next-auth/react";

// const StateContext = createContext();

// export const StateContextProvider = ({ children }) => {
//   const [campaigns, setCampaigns] = useState([]);
//   const [userCampaigns, setUserCampaigns] = useState([]);
//   const [donors, setDonors] = useState([]);
//   const [recipients, setRecipients] = useState([]);
//   const [address, setAddress] = useState(null);
//   const [contract, setContract] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const { data: session } = useSession();

//   // Function to create a notification in the backend
//   const createNotification = async (type, message, data = {}) => {
//     if (!session?.user?.accessToken) return;

//     try {
//       await fetch(
//         `${
//           process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
//         }/api/notifications`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${session.user.accessToken}`,
//           },
//           body: JSON.stringify({ type, message, data }),
//         }
//       );
//     } catch (error) {
//       console.error("Failed to create notification:", error);
//     }
//   };

//   // Connect to MetaMask - Fixed implementation
//   const connect = async () => {
//     // if (!window.ethereum) {
//     //   alert("Please install MetaMask to use this feature.");
//     //   window.open("https://metamask.io/download/", "_blank");
//     //   return;
//     // }

//     setIsLoading(true);
//     try {
//       // // Request account access
//       // const accounts = await window.ethereum.request({
//       //   method: "eth_requestAccounts",
//       // });

//       // if (accounts.length > 0) {
//       //   setAddress(accounts[0]);

//       // Set up contract instance
//       // const provider = new ethers.BrowserProvider(window.ethereum);
//       // const signer = await provider.getSigner();

//       // const contractInstance = new ethers.Contract(
//       //   "0x5fbdb2315678afecb367f032d93f642f64180aa3",
//       //   CampaignFactoryABI.abi,
//       //   signer

//       const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
//       const signers = await provider.listAccounts();

//       console.log("Signer:", signers[4]);

//       const response = await fetch("/api/user", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email: session?.user?.email }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch user data");
//       }

//       const userData = await response.json();
//       console.log("User data fetched:", userData);
//       // Check if the MetaMask address matches the user's smartWalletAddress
//       if (userData.smartWalletAddress !== signers[4]) {
//         alert(
//           "The connected wallet does not match your registered smart wallet address. Please connect the correct wallet."
//         );
//         return;
//       }

//       setAddress(signers[4]);

//       const contract = new ethers.Contract(
//         "0x5fbdb2315678afecb367f032d93f642f64180aa3",
//         CampaignFactoryABI.abi,
//         signers[4]
//       );

//       setContract(contract);
//       fetchCampaigns(); // Fetch campaigns after successful connection
//       // } else {
//       //   alert("No accounts found. Please unlock MetaMask and try again.");
//       // }
//     } catch (error) {
//       console.error("Failed to connect to MetaMask:", error);
//       alert("Failed to connect to MetaMask. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchDonors = async (campaignId) => {
//     setIsLoading(true);
//     try {
//       const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
//       const signers = await provider.listAccounts();
//       const contract = new ethers.Contract(
//         "0x5fbdb2315678afecb367f032d93f642f64180aa3",
//         CampaignFactoryABI.abi,
//         signers[4]
//       );
//       setContract(contract);

//       const donors = await contract.getCampaignDonors(campaignId);
//       setDonors(donors);
//     } catch (error) {
//       console.error("Failed to fetch donors:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchRecipients = async (campaignId) => {
//     setIsLoading(true);
//     try {
//       const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
//       const signers = await provider.listAccounts();
//       const contract = new ethers.Contract(
//         "0x5fbdb2315678afecb367f032d93f642f64180aa3",
//         CampaignFactoryABI.abi,
//         signers[4]
//       );
//       setContract(contract);

//       const recipients = await contract.getCampaignRecipients(campaignId);
//       setRecipients(recipients);
//     } catch (error) {
//       console.error("Failed to fetch recipients:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch campaigns from the contract - Fix to load regardless of wallet connection
//   const fetchCampaigns = async () => {
//     setIsLoading(true);
//     try {
//       const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
//       const signers = await provider.listAccounts();
//       const contract = new ethers.Contract(
//         "0x5fbdb2315678afecb367f032d93f642f64180aa3",
//         CampaignFactoryABI.abi,
//         signers[4]
//       );

//       const campaigns = await contract.getAllCampaigns();
//       setCampaigns(campaigns);
//     } catch (error) {
//       console.error("Failed to fetch campaigns:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Listen for account changes in MetaMask
//   useEffect(() => {
//     if (!window.ethereum) return;

//     const handleAccountsChanged = (accounts) => {
//       if (accounts.length > 0) {
//         setAddress(accounts[0]);
//       } else {
//         setAddress(null);
//       }
//     };

//     window.ethereum.on("accountsChanged", handleAccountsChanged);

//     // Check if already connected
//     const checkConnection = async () => {
//       try {
//         const accounts = await window.ethereum.request({
//           method: "eth_accounts",
//         });
//         if (accounts.length > 0) {
//           setAddress(accounts[0]);

//           const provider = new ethers.BrowserProvider(window.ethereum);
//           const signer = await provider.getSigner();

//           const contractInstance = new ethers.Contract(
//             "0x5fbdb2315678afecb367f032d93f642f64180aa3",
//             CampaignFactoryABI.abi,
//             signer
//           );

//           setContract(contractInstance);
//         }
//       } catch (error) {
//         console.error("Error checking connection:", error);
//       }
//     };

//     checkConnection();

//     return () => {
//       window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
//     };
//   }, []);

//   // Automatically fetch campaigns on component mount
//   useEffect(() => {
//     fetchCampaigns();
//   }, []);

//   // Update the getUserCampaigns function:

//   const getUserCampaigns = async () => {
//     if (!address) return;

//     setIsLoading(true);
//     try {
//       // Use JsonRpcProvider for consistent provider access
//       const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
//       const contractWithProvider = new ethers.Contract(
//         "0x5fbdb2315678afecb367f032d93f642f64180aa3", // Your contract address
//         CampaignFactoryABI.abi,
//         provider
//       );

//       // Use the connected wallet address
//       const userCampaignsList = await contractWithProvider.getUserCampaigns(
//         address
//       );
//       console.log("User campaigns fetched:", userCampaignsList);

//       setUserCampaigns(userCampaignsList || []);

//       return userCampaignsList;
//     } catch (error) {
//       console.error("Failed to fetch user campaigns:", error);
//       setUserCampaigns([]); // Set to empty array on error
//       return [];
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   const createCampaign = async (form) => {
//     try {
//       setIsLoading(true);

//       const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
//       const signers = await provider.listAccounts();
//       console.log("Signer:", signers);

//       const contract = new ethers.Contract(
//         "0x5fbdb2315678afecb367f032d93f642f64180aa3",
//         CampaignFactoryABI.abi,
//         signers[4]
//       );

//       const deadline = new Date(form.deadline).getTime();
//       const goal = form.target;
//       const recipients = form.recipients;

//       // Call smart contract function
//       const transaction = await contract.createCampaign(
//         form.title,
//         form.description,
//         goal,
//         recipients,
//         deadline,
//         form.image
//       );

//       // Wait for transaction to be mined
//       await transaction.wait();

//       console.log("Campaign created successfully:", transaction);

//       // Add notification for campaign creation
//       if (session?.user) {
//         await createNotification(
//           "CAMPAIGN_CREATED",
//           `Your campaign "${form.title}" has been created successfully!`,
//           { campaignTitle: form.title, campaignId: transaction.hash }
//         );
//       }

//       // Refresh campaigns after creating a new one
//       await fetchCampaigns();
//     } catch (error) {
//       console.error("Contract error:", error);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const donate = async (campaignId, donationAmount) => {
//     if (!address) {
//       alert("Please connect your wallet to donate.");
//       return;
//     }

//     if (!campaignId || donationAmount <= 0) {
//       alert("Invalid campaign ID or donation amount.");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
//       const signers = await provider.listAccounts();
//       const contract = new ethers.Contract(
//         "0x5fbdb2315678afecb367f032d93f642f64180aa3",
//         CampaignFactoryABI.abi,
//         signers[4]
//       );

//       // Convert donation amount to Wei
//       const donationAmountWei = ethers.parseEther(donationAmount.toString());

//       // Find campaign details for notification
//       const campaign = campaigns.find((c) => c.id == campaignId);
//       const campaignTitle = campaign
//         ? campaign.title
//         : "Campaign #" + campaignId;

//       // Call the donate function in the smart contract
//       const transaction = await contract.donate(campaignId, {
//         value: donationAmountWei,
//       });

//       // Wait for the transaction to be mined
//       await transaction.wait();

//       console.log("Donation successful:", transaction);

//       // Create notification for donation
//       if (session?.user) {
//         await createNotification(
//           "DONATION",
//           `You donated ${donationAmount} ETH to campaign "${campaignTitle}"`,
//           { campaignId, campaignTitle, amount: donationAmount }
//         );
//       }

//       alert("Donation successful!");

//       // Refresh the campaigns list after donation
//       await fetchCampaigns();
//     } catch (error) {
//       console.error("Failed to donate:", error);
//       alert("Failed to donate. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <StateContext.Provider
//       value={{
//         address,
//         connect,
//         campaigns,
//         fetchCampaigns,
//         isLoading,
//         getUserCampaigns,
//         userCampaigns,
//         createCampaign,
//         donate,
//         donors,
//         fetchDonors,
//         recipients,
//         fetchRecipients,
//       }}
//     >
//       {children}
//     </StateContext.Provider>
//   );
// };

// export const useStateContext = () => useContext(StateContext);

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
  const [recipients, setRecipients] = useState([]);
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  // Function to create a notification in the backend
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

  // Connect to MetaMask - Fixed implementation
  const connect = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this feature.");
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    setIsLoading(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setAddress(accounts[0]);

        // Set up contract instance
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const contractInstance = new ethers.Contract(
          "0x24aF9c16859b32b5719B7Fc6b39815030B9b5621",
          CampaignFactoryABI.abi,
          signer
        );

        setContract(contractInstance);
        fetchCampaigns(); // Fetch campaigns after successful connection
      } else {
        alert("No accounts found. Please unlock MetaMask and try again.");
      }
    } catch (error) {
      console.error("Failed to connect to MetaMask:", error);
      alert("Failed to connect to MetaMask. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDonors = async (campaignId) => {
    setIsLoading(true);
    try {
      // const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
      // const signers = await provider.listAccounts();
      // const contract = new ethers.Contract(
      //   "0x5fbdb2315678afecb367f032d93f642f64180aa3",
      //   CampaignFactoryABI.abi,
      //   signers[4]

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        //process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        "0x24aF9c16859b32b5719B7Fc6b39815030B9b5621",
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
      // const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
      // const signers = await provider.listAccounts();
      // const contract = new ethers.Contract(
      //   "0x5fbdb2315678afecb367f032d93f642f64180aa3",
      //   CampaignFactoryABI.abi,
      //   signers[4]

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        //process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        "0x24aF9c16859b32b5719B7Fc6b39815030B9b5621",
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

  // Fetch campaigns from the contract - Fix to load regardless of wallet connection
  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      // const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
      // const signers = await provider.listAccounts();
      // const contract = new ethers.Contract(
      //   "0x5fbdb2315678afecb367f032d93f642f64180aa3",
      //   CampaignFactoryABI.abi,
      //   signers[3]
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        //process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        "0x24aF9c16859b32b5719B7Fc6b39815030B9b5621",
        CampaignFactoryABI.abi,
        signer
      );

      const campaigns = await contract.getAllCampaigns();
      //console.log("Campaigns fetched:", campaigns);
      setCampaigns(campaigns);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for account changes in MetaMask
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

    // Check if already connected
    const checkConnection = async () => {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setAddress(accounts[0]);

          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();

          const contractInstance = new ethers.Contract(
            "0x24aF9c16859b32b5719B7Fc6b39815030B9b5621",
            CampaignFactoryABI.abi,
            signer
          );

          setContract(contractInstance);
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    };

    checkConnection();

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  // Automatically fetch campaigns on component mount
  useEffect(() => {
    fetchCampaigns();
  }, []);
  // Add after the existing useEffect that fetchs campaigns (around line 614)

// Add a separate useEffect for deadline checks
useEffect(() => {
  if (campaigns.length > 0 && session?.user) {
    // Check deadlines immediately after campaigns are loaded
    checkCampaignDeadlines();
    
    // Set up interval to periodically check deadlines (every 6 hours)
    const deadlineInterval = setInterval(() => {
      checkCampaignDeadlines();
    }, 6 * 60 * 60 * 1000); // Check every 6 hours
    
    return () => {
      clearInterval(deadlineInterval);
    };
  }
}, [campaigns, session]);
  // Update the getUserCampaigns function:

  const getUserCampaigns = async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        //process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        "0x24aF9c16859b32b5719B7Fc6b39815030B9b5621",
        CampaignFactoryABI.abi,
        signer
      );

      // Use the connected wallet address
      const userCampaignsList = await contract.getUserCampaigns(address);
      console.log("User campaigns fetched:", userCampaignsList);

      setUserCampaigns(userCampaignsList || []);

      return userCampaignsList;
    } catch (error) {
      console.error("Failed to fetch user campaigns:", error);
      setUserCampaigns([]); // Set to empty array on error
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Add this function to the Campaign component

const getCampaignsByOwner = async (ownerAddress) => {
  if (!ownerAddress) return [];
  
  setIsLoading(true);
  
  try {
    // Get campaigns from the blockchain
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      "0x24aF9c16859b32b5719B7Fc6b39815030B9b5621",
      CampaignFactoryABI.abi,
      signer
    );
    
    // First check if we already have campaigns loaded
    let allCampaigns = campaigns;
    if (allCampaigns.length === 0) {
      allCampaigns = await contract.getCampaigns();
    }
    
    // Filter campaigns by owner
    const ownerCampaigns = allCampaigns.filter(
      campaign => campaign[5].toLowerCase() === ownerAddress.toLowerCase()
    );
    
    return ownerCampaigns;
  } catch (error) {
    console.error("Failed to fetch campaigns by owner:", error);
    return [];
  } finally {
    setIsLoading(false);
  }
};

  
  const createCampaign = async (form) => {
    setIsLoading(true);
    try {
      // const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
      // const signers = await provider.listAccounts();
      // console.log("Signer:", signers);

      // const contract = new ethers.Contract(
      //   "0x5fbdb2315678afecb367f032d93f642f64180aa3",
      //   CampaignFactoryABI.abi,
      //   signers[4]

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        //process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        "0x24aF9c16859b32b5719B7Fc6b39815030B9b5621",
        CampaignFactoryABI.abi,
        signer
      );

      const deadline = new Date(form.deadline).getTime();
      const goal = form.target;
      const recipients = form.recipients;

      // Call smart contract function
      const transaction = await contract.createCampaign(
        form.title,
        form.description,
        goal,
        recipients,
        deadline,
        form.image,
        {
          gasLimit: 9999000, // Increase gas limit
        }
      );

      // Wait for transaction to be mined
      await transaction.wait();

      console.log("Campaign created successfully:", transaction);

      // Add notification for campaign creation
      if (session?.user) {
        await createNotification(
          "CAMPAIGN_CREATED",
          `Your campaign "${form.title}" has been created successfully!`,
          { campaignTitle: form.title, campaignId: transaction.hash }
        );
      }

      // Refresh campaigns after creating a new one
      await fetchCampaigns();
    } catch (error) {
      console.error("Contract error:", error);
      throw error;
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
      // const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
      // const signers = await provider.listAccounts();
      // const contract = new ethers.Contract(
      //   "0x5fbdb2315678afecb367f032d93f642f64180aa3",
      //   CampaignFactoryABI.abi,
      //   signers[4]

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        //process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        "0x24aF9c16859b32b5719B7Fc6b39815030B9b5621",
        CampaignFactoryABI.abi,
        signer
      );

      // Convert donation amount to Wei
      const donationAmountWei = ethers.parseEther(donationAmount.toString());

      // Find campaign details for notification
      const campaign = campaigns.find((c) => c.id == campaignId);
      const campaignTitle = campaign
        ? campaign.title
        : "Campaign #" + campaignId;

      // Call the donate function in the smart contract
      const transaction = await contract.donate(campaignId, {
        value: donationAmountWei,
      });

      // Wait for the transaction to be mined
      await transaction.wait();

      console.log("Donation successful:", transaction);

      // Create notification for donation
      if (session?.user) {
        await createNotification(
          "DONATION",
          `You donated ${donationAmount} ETH to campaign "${campaignTitle}"`,
          { campaignId, campaignTitle, amount: donationAmount }
        );
      }
      try {
        // Find the campaign owner's ID from the database
        const ownerResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/address/${campaign.owner}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.accessToken}`
          }
        });
        
        if (ownerResponse.ok) {
          const ownerData = await ownerResponse.json();
          // Create notification for the campaign owner
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session?.accessToken}`
            },
            body: JSON.stringify({
              userId: ownerData.id,
              type: 'DONATION_RECEIVED',
              message: `Someone donated ${donationAmount} ETH to your campaign "${campaignTitle}"`,
              data: { campaignId, campaignTitle, amount: donationAmount }
            })
          });
        }
      } catch (error) {
        console.error("Failed to notify campaign owner:", error);
      }
      
      alert("Donation successful!");
      
      // Refresh the campaigns list after donation
      await fetchCampaigns();
    } catch (error) {
      console.error("Failed to donate:", error);
      alert("Failed to donate. Please try again.");
    } finally {
      setIsLoading(false);
    }
    // In the donate function, after successful donation and before the alerts:

// Check if the campaign reached a milestone
try {
  // Calculate campaign progress percentage
  const goalWei = ethers.parseEther(campaign.goal.toString());
  const raisedWithNewDonation = ethers.parseEther(campaign.raised.toString()) + donationAmountWei;
  const progressPercentage = Math.floor((raisedWithNewDonation * BigInt(100)) / goalWei);
  
  // Define milestones (25%, 50%, 75%, 100%)
  const milestones = [25, 50, 75, 100];
  
  // Check if a milestone was just crossed
  for (const milestone of milestones) {
    const previousProgress = Math.floor((ethers.parseEther(campaign.raised.toString()) * BigInt(100)) / goalWei);
    
    // If we just crossed this milestone
    if (progressPercentage >= milestone && previousProgress < milestone) {
      // Find the campaign owner's ID from the database
      const ownerResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/address/${campaign.owner}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`
        }
      });
      
      if (ownerResponse.ok) {
        const ownerData = await ownerResponse.json();
        // Create milestone notification for the campaign owner
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.accessToken}`
          },
          body: JSON.stringify({
            userId: ownerData.id,
            type: 'CAMPAIGN_MILESTONE',
            message: `Your campaign "${campaignTitle}" has reached ${milestone}% of its goal!`,
            data: { campaignId, campaignTitle, milestone }
          })
        });
      }
      
      // If we've reached 100%, send a completion notification
      if (milestone === 100) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.accessToken}`
          },
          body: JSON.stringify({
            userId: ownerData.id,
            type: 'CAMPAIGN_COMPLETE',
            message: `Congratulations! Your campaign "${campaignTitle}" has been fully funded!`,
            data: { campaignId, campaignTitle }
          })
        });
      }
    }
  }
} catch (error) {
  console.error("Failed to check campaign milestone:", error);
}
  };
  // Add after the donate function (around line 922)

// Function to check campaign deadlines
const checkCampaignDeadlines = async () => {
  try {
    if (!campaigns || !campaigns.length || !session?.user) return;
    
    const now = Date.now();
    
    for (const campaign of campaigns) {
      // Skip if campaign is not active
      if (!campaign.isActive) continue;
      
      const deadline = Number(campaign.deadline) * 1000; // Convert to milliseconds
      
      // If deadline is within 24 hours or has passed and notification hasn't been sent yet
      if (deadline <= now + 24 * 60 * 60 * 1000 && deadline > now - 24 * 60 * 60 * 1000) {
        try {
          // Find the campaign owner's ID from the database
          const ownerResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/address/${campaign.owner}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session?.accessToken}`
            }
          });
          
          if (ownerResponse.ok) {
            const ownerData = await ownerResponse.json();
            
            // Create deadline notification for the campaign owner
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.accessToken}`
              },
              body: JSON.stringify({
                userId: ownerData.id,
                type: 'CAMPAIGN_DEADLINE',
                message: deadline <= now 
                  ? `Your campaign "${campaign.title}" has reached its deadline.` 
                  : `Your campaign "${campaign.title}" will reach its deadline within 24 hours.`,
                data: { 
                  campaignId: campaign.id, 
                  campaignTitle: campaign.title,
                  deadlineReached: deadline <= now
                }
              })
            });
          }
        } catch (error) {
          console.error(`Failed to send deadline notification for campaign ${campaign.id}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Failed to check campaign deadlines:", error);
  }
};

  return (
    <StateContext.Provider
      value={{
        address,
        connect,
        campaigns,
        fetchCampaigns,
        getCampaignsByOwner, // Add this line
        isLoading,
        getUserCampaigns,
        userCampaigns,
        createCampaign,
        donate,
        donors,
        fetchDonors,
        recipients,
        fetchRecipients,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
