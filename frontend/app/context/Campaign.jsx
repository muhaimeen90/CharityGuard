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
  const [donatedCampaigns, setDonatedCampaigns] = useState([]);
  //const [campaignsDonatedTo, setCampaignsDonatedTo] = useState([]);
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

  const campaignsDonatedTo = async () => {
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
      const userCampaignsList = await contract.getUserDonations(address);
      console.log("User's donated campaigns fetched:", userCampaignsList);

      setDonatedCampaigns(userCampaignsList || []);

      return userCampaignsList;
    } catch (error) {
      console.error("Failed to fetch user donated campaigns:", error);
      setDonatedCampaigns([]); // Set to empty array on error
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

      alert("Donation successful!");

      // Refresh the campaigns list after donation
      await fetchCampaigns();
    } catch (error) {
      console.error("Failed to donate:", error);
      alert("Failed to donate. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StateContext.Provider
      value={{
        address,
        connect,
        campaigns,
        fetchCampaigns,
        isLoading,
        getUserCampaigns,
        userCampaigns,
        createCampaign,
        donate,
        donors,
        fetchDonors,
        recipients,
        fetchRecipients,
        campaignsDonatedTo,
        donatedCampaigns,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
