"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useStateContext } from "../../context/Campaign";
import DisplayCampaigns from "../../components/DisplayCampaigns";
import Loader from "../../components/Loader";
import { profile } from "../../assets";
import { ethers } from "ethers";
import { useSession } from "next-auth/react";
import Image from "next/image";

const UserProfilePage = () => {
  const { address: userAddress } = useParams();
  const {
    campaigns,
    fetchCampaigns,
    getCampaignsByOwner,
    isLoading: contextLoading,
  } = useStateContext();
  const [userCampaigns, setUserCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [donationsTotal, setDonationsTotal] = useState(0);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userAddress) return;
      
      setIsLoading(true);
      try {
        console.log(`Fetching user data for address: ${userAddress}`);
        // Use the Next.js API route
        const response = await fetch(`/api/users/address/${userAddress}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response:", errorData);
          throw new Error(errorData.error || 'Failed to fetch user data');
        }
        
        const data = await response.json();
        console.log("User data fetched:", data);
        setUserData(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message || "Failed to load user information");
      }
    };

    fetchUserData();
  }, [userAddress]);

  // Fetch user campaigns
  useEffect(() => {
    const loadUserCampaigns = async () => {
      try {
        if (campaigns.length === 0) {
          await fetchCampaigns();
        }

        const filteredCampaigns = campaigns.filter(
          (campaign) =>
            campaign[5]?.toLowerCase() === userAddress?.toLowerCase()
        );

        setUserCampaigns(filteredCampaigns);

        // Calculate total donations
        let total = 0;
        filteredCampaigns.forEach((campaign) => {
          if (campaign[4]) {
            // campaign[4] contains the raised amount
            total += Number(ethers.formatEther(campaign[4].toString()));
          }
        });

        setDonationsTotal(total.toFixed(2));
      } catch (error) {
        console.error("Failed to load user campaigns:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userAddress) {
      loadUserCampaigns();
    }
  }, [userAddress, campaigns, fetchCampaigns]);

  return (
    <div className="flex flex-col">
      {/* User Profile Card */}
      <div className="bg-[#1c1c24] rounded-[20px] p-6 mb-8">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <div className="text-white text-center p-4 bg-red-500 bg-opacity-20 rounded-md">
            {error}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Picture */}
            <div className="w-[120px] h-[120px] rounded-full bg-[#2c2f32] flex items-center justify-center">
              <Image src={profile} alt="profile" height={120} width={120} />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="font-epilogue font-bold text-[24px] text-white">
                {userData?.role === "CHARITY" ? "Charity" : "Donor"} Profile
              </h2>
              {userData?.email && (
                <p className="mt-1 font-epilogue text-[#808191]">
                  Email: <span className="text-white">{userData.email}</span>
                </p>
              )}
              <p className="mt-1 font-epilogue text-[#808191]">
                Role:{" "}
                <span className="text-white">{userData?.role || "N/A"}</span>
              </p>
              <p className="mt-1 font-epilogue text-[#808191]">
                Wallet:{" "}
                <span className="text-white break-all">{userAddress}</span>
              </p>
              <p className="mt-1 font-epilogue text-[#808191]">
                Total Raised:{" "}
                <span className="text-white">{donationsTotal} ETH</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* User Campaigns */}
      <div>
        <h2 className="font-epilogue font-semibold text-[18px] text-white mb-4">
          {userData?.role === "CHARITY" ? "Campaigns Created" : "Campaigns Supported"}
        </h2>

        {isLoading && <Loader />}

        {!isLoading && userCampaigns.length === 0 && (
          <p className="font-epilogue text-[#808191] text-center">
            No campaigns found
          </p>
        )}

        {!isLoading && userCampaigns.length > 0 && (
          <DisplayCampaigns
            title="All Campaigns"
            campaigns={userCampaigns}
            address={userAddress}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;