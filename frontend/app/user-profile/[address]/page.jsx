"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useStateContext } from "../../context/Campaign";
import DisplayCampaigns from "../../components/DisplayCampaigns";
import Loader from "../../components/Loader";
import { thirdweb2 } from "../../assets";
import { ethers } from "ethers";
import { useSession } from "next-auth/react";

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

      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
          }/api/users/wallet/${userAddress}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user information");
      }
    };

    fetchUserData();
  }, [userAddress]);

  // Fetch user campaigns
  useEffect(() => {
    const loadUserCampaigns = async () => {
      setIsLoading(true);
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
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Picture */}
          <div className="w-[120px] h-[120px] rounded-full bg-[#2c2f32] flex items-center justify-center">
            <img
              src={thirdweb2}
              alt="profile"
              className="w-[60%] h-[60%] object-contain"
            />
          </div>

          {/* User Information */}
          <div className="flex-1">
            <h2 className="font-epilogue font-bold text-[24px] text-white">
              Creator Profile
            </h2>

            {isLoading ? (
              <p className="font-epilogue font-normal text-[16px] text-[#808191]">
                Loading...
              </p>
            ) : userData ? (
              <>
                <p className="font-epilogue font-normal text-[16px] text-[#808191]">
                  <span className="text-white">Email: </span>
                  {userData.email || "Not provided"}
                </p>
                <p className="font-epilogue font-normal text-[16px] text-[#808191] break-all">
                  <span className="text-white">Wallet Address: </span>
                  {userData.smartWalletAddress || userAddress}
                </p>
                {userData.role && (
                  <p className="font-epilogue font-normal text-[16px] text-[#808191]">
                    <span className="text-white">Role: </span>
                    {userData.role}
                  </p>
                )}
              </>
            ) : (
              <p className="font-epilogue font-normal text-[16px] text-[#808191] break-all">
                {userAddress}
                {error && (
                  <span className="text-red-500 block mt-2">{error}</span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-[#1c1c24] rounded-[15px] p-4">
          <h3 className="font-epilogue font-semibold text-[18px] text-white">
            {userCampaigns?.length || 0}
          </h3>
          <p className="font-epilogue text-[#808191]">Campaigns Created</p>
        </div>

        <div className="bg-[#1c1c24] rounded-[15px] p-4">
          <h3 className="font-epilogue font-semibold text-[18px] text-white">
            {donationsTotal} ETH
          </h3>
          <p className="font-epilogue text-[#808191]">Total Raised</p>
        </div>
      </div>

      {/* User Campaigns */}
      {isLoading ? (
        <Loader />
      ) : (
        <DisplayCampaigns
          title="Created Campaigns"
          isLoading={false}
          campaigns={userCampaigns}
        />
      )}
    </div>
  );
};

export default UserProfilePage;
