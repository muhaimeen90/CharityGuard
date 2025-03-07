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
    campaignsDonatedTo,
    donatedCampaigns,
    isLoading: contextLoading,
  } = useStateContext();
  const [userCampaigns, setUserCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [donationsTotal, setDonationsTotal] = useState(0);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const [usersDonatedCampaigns, setUsersDonatedCampaigns] = useState([]);
  const [showCreated, setShowCreated] = useState(false);
  const [showDonated, setShowDonated] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userAddress) return;

      setIsLoading(true);
      try {
        console.log(`Fetching user data for address: ${userAddress}`);
        const response = await fetch(`/api/users/address/${userAddress}`);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response:", errorData);
          throw new Error(errorData.error || "Failed to fetch user data");
        }

        const data = await response.json();
        console.log("User data fetched:", data);
        setUserData(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message || "Failed to load user information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userAddress]);

  const handleShowCreated = async () => {
    setIsLoading(true);
    try {
      if (userData?.role === "CHARITY" || userData?.role === "FUNDRAISER") {
        const filteredCampaigns = campaigns.filter(
          (campaign) =>
            campaign[5]?.toLowerCase() === userAddress?.toLowerCase()
        );
        const uniqueCampaigns = filterUniqueCampaigns(filteredCampaigns);

        setUserCampaigns(uniqueCampaigns);
      }
      setShowCreated(true);
      setShowDonated(false);
      let total = 0;
      if (userCampaigns) {
        userCampaigns.forEach((campaign) => {
          if (campaign[4]) {
            total += Number(ethers.formatEther(campaign[4].toString()));
          }
        });
      }

      setDonationsTotal(total.toFixed(2));
      console.log("Total donations:", donationsTotal);
    } catch (error) {
      console.error("Failed to load user campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowDonated = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching donated campaigns for:", userAddress);
      await campaignsDonatedTo(userAddress);
      const uniqueCampaigns = filterUniqueCampaigns(donatedCampaigns);

      setUsersDonatedCampaigns(uniqueCampaigns);
      setShowDonated(true);
      setShowCreated(false);
    } catch (error) {
      console.error("Failed to load donated campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUniqueCampaigns = (campaigns) => {
    const uniqueCampaigns = [];
    const seenCampaigns = new Set();

    campaigns.forEach((campaign) => {
      const campaignId = campaign[0];
      if (!seenCampaigns.has(campaignId)) {
        seenCampaigns.add(campaignId);
        uniqueCampaigns.push(campaign);
      }
    });

    return uniqueCampaigns;
  };

  console.log("User campaigns:", userCampaigns);
  console.log("Donated campaigns:", donatedCampaigns);
  console.log("User data:", userData);

  return (
    <div className="flex flex-col p-6 bg-[#13131a] min-h-screen">
      <div className="bg-[#1c1c24] rounded-[20px] p-6 mb-8">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <div className="text-white text-center p-4 bg-red-500 bg-opacity-20 rounded-md">
            {error}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-[120px] h-[120px] rounded-full bg-[#2c2f32] flex items-center justify-center">
              <Image src={profile} alt="profile" height={120} width={120} />
            </div>
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
              {userData?.role !== "DONOR" && showCreated && (
                <p className="mt-1 font-epilogue text-[#808191]">
                  Total Raised:{" "}
                  <span className="text-white">{donationsTotal} ETH</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4 mb-8">
        {(userData?.role === "CHARITY" || userData?.role === "FUNDRAISER") && (
          <button
            className="font-epilogue font-semibold text-[16px] text-white min-h-[52px] px-6 rounded-full bg-[#1dc071] hover:bg-[#14a85d] transition-all"
            onClick={handleShowCreated}
          >
            Created Campaigns
          </button>
        )}
        <button
          className="font-epilogue font-semibold text-[16px] text-white min-h-[52px] px-6 rounded-full bg-[#8c6dfd] hover:bg-[#7b5de8] transition-all"
          onClick={handleShowDonated}
        >
          Donated Campaigns
        </button>
      </div>

      <div>
        {isLoading && <Loader />}

        {showCreated && !isLoading && userCampaigns.length === 0 && (
          <p className="font-epilogue text-[#808191] text-center">
            No created campaigns found
          </p>
        )}

        {showCreated && !isLoading && userCampaigns.length > 0 && (
          <DisplayCampaigns
            title="Campaigns Created"
            campaigns={userCampaigns}
            address={userAddress}
          />
        )}

        {showDonated && !isLoading && usersDonatedCampaigns.length === 0 && (
          <p className="font-epilogue text-[#808191] text-center">
            No donated campaigns found
          </p>
        )}

        {showDonated && !isLoading && usersDonatedCampaigns.length > 0 && (
          <DisplayCampaigns
            title="Campaigns Supported"
            campaigns={usersDonatedCampaigns}
            address={userAddress}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
