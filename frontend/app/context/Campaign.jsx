"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import CampaignFactoryABI from "../abis/CampaignFactory.json";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Connect to MetaMask
  const connect = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this feature.");
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    if (isLoading) return; // Prevent multiple connection attempts

    setIsLoading(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length > 0) {
        setAddress(accounts[0]);
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

  // Fetch campaigns from the contract
  const fetchCampaigns = async () => {
    if (!address) return; // Only fetch campaigns if the user is connected

    setIsLoading(true);
    try {
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/"); // Local Hardhat network URL
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        //process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        "0x5fbdb2315678afecb367f032d93f642f64180aa3",
        CampaignFactoryABI.abi,
        signer
      );
      setContract(contract);

      const campaigns = await contract.getAllCampaigns();

      setCampaigns(campaigns);
      //console.log(campaigns);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      alert("Failed to fetch campaigns. Please try again.");
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
        setAddress(null); // User disconnected their wallet
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  // Automatically fetch campaigns when the address changes
  useEffect(() => {
    if (address) {
      fetchCampaigns();
    }
  }, [address]);

  const getUserCampaigns = async () => {
    if (!address) return; // Only fetch campaigns if the user is connected

    setIsLoading(true);
    try {
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        CampaignFactoryABI.abi,
        signer
      );
      setContract(contract);

      const campaigns = await contract.getUserCampaigns();
      setCampaigns(campaigns);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      alert("Failed to fetch campaigns. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // const getCampaigns = async () => {
  //   setIsLoading(true);
  //   try {
  //     const allCampaigns = await fetchAllCampaigns();
  //     setCampaigns(allCampaigns);
  //   } catch (error) {
  //     console.error("Failed to fetch campaigns:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const createCampaign = async (form) => {
    try {
      setIsLoading(true);
      // Connect to Ethereum provider
      console.log("ABI:", CampaignFactoryABI);

      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
      const signer = await provider.getSigner();

      // Create contract instance

      const contract = new ethers.Contract(
        //process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        "0x5fbdb2315678afecb367f032d93f642f64180aa3",
        CampaignFactoryABI.abi,
        signer
      );

      // Convert form data for blockchain
      const deadline = new Date(form.deadline).getTime();
      const targetAmount = form.target;
      const recipients = form.recipients;

      // Call smart contract function
      const transaction = await contract.createCampaign(
        form.title,
        form.description,

        targetAmount,
        recipients,
        deadline,
        form.image
      );

      // Wait for transaction to be mined
      await transaction.wait();

      console.log("Campaign created successfully:", transaction);
    } catch (error) {
      console.error("Contract error:", error);
      throw error;
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
        createCampaign,
        //getCampaigns,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);









// "use client";

// import React, { createContext, useContext, useState, useEffect } from "react";
// import { ethers } from "ethers";
// import CampaignFactoryABI from "../abis/CampaignFactory.json";

// const StateContext = createContext();

// export const StateContextProvider = ({ children }) => {
//   const [campaigns, setCampaigns] = useState([]);
//   const [address, setAddress] = useState(null);
//   const [contract, setContract] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   // Connect to MetaMask
//   const connect = async () => {
//     if (!window.ethereum) {
//       alert("Please install MetaMask to use this feature.");
//       window.open("https://metamask.io/download/", "_blank");
//       return;
//     }

//     if (isLoading) return; // Prevent multiple connection attempts

//     setIsLoading(true);
//     try {
//       const accounts = await window.ethereum.request({
//         method: "eth_requestAccounts",
//       });
//       if (accounts.length > 0) {
//         setAddress(accounts[0]);
//       } else {
//         alert("No accounts found. Please unlock MetaMask and try again.");
//       }
//     } catch (error) {
//       console.error("Failed to connect to MetaMask:", error);
//       alert("Failed to connect to MetaMask. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch campaigns from the contract
//   const fetchCampaigns = async () => {
//     if (!address) return; // Only fetch campaigns if the user is connected

//     setIsLoading(true);
//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const contract = new ethers.Contract(
//         process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
//         CampaignFactoryABI.abi,
//         signer
//       );
//       setContract(contract);

//       const campaigns = await contract.getAllCampaigns();
//       setCampaigns(campaigns);
//     } catch (error) {
//       console.error("Failed to fetch campaigns:", error);
//       alert("Failed to fetch campaigns. Please try again.");
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
//         setAddress(null); // User disconnected their wallet
//       }
//     };

//     window.ethereum.on("accountsChanged", handleAccountsChanged);

//     return () => {
//       window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
//     };
//   }, []);

//   // Automatically fetch campaigns when the address changes
//   useEffect(() => {
//     if (address) {
//       fetchCampaigns();
//     }
//   }, [address]);

//   const getUserCampaigns = async () => {
//     if (!address) return; // Only fetch campaigns if the user is connected

//     setIsLoading(true);
//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const contract = new ethers.Contract(
//         process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
//         CampaignFactoryABI.abi,
//         signer
//       );
//       setContract(contract);

//       const campaigns = await contract.getUserCampaigns();
//       setCampaigns(campaigns);
//     } catch (error) {
//       console.error("Failed to fetch campaigns:", error);
//       alert("Failed to fetch campaigns. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // const getCampaigns = async () => {
//   //   setIsLoading(true);
//   //   try {
//   //     const allCampaigns = await fetchAllCampaigns();
//   //     setCampaigns(allCampaigns);
//   //   } catch (error) {
//   //     console.error("Failed to fetch campaigns:", error);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };
//   const createCampaign = async (form) => {
//     try {
//       setIsLoading(true);
//       // Connect to Ethereum provider
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = provider.getSigner();

//       // Create contract instance
//       const contract = new ethers.Contract(
//         process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
//         CampaignFactoryABI.abi,
//         signer
//       );

//       // Convert form data for blockchain
//       const deadline = new Date(form.deadline).getTime();
//       const targetAmount = ethers.parseEther(form.target);

//       // Call smart contract function
//       const transaction = await contract.createCampaign(
//         form.title,
//         form.description,
//         targetAmount,
//         deadline,
//         form.image
//       );

//       // Wait for transaction to be mined
//       await transaction.wait();

//       console.log("Campaign created successfully:", transaction);
//     } catch (error) {
//       console.error("Contract error:", error);
//       throw error;
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
//         createCampaign,
//         //getCampaigns,
//       }}
//     >
//       {children}
//     </StateContext.Provider>
//   );
// };

// export const useStateContext = () => useContext(StateContext);
