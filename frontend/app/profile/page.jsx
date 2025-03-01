"use client";

import React, { useState, useEffect } from "react";
import { useStateContext } from "../context/Campaign";
import FundCard from "../components/FundCard";

const ProfilePage = () => {
  const { address, getUserCampaigns } = useStateContext();
  const [userCampaigns, setUserCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserCampaigns = async () => {
      setIsLoading(true);
      try {
        const campaigns = await getUserCampaigns();
        setUserCampaigns(campaigns);
      } catch (error) {
        console.error("Failed to fetch user campaigns:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (address) fetchUserCampaigns();
  }, [address, getUserCampaigns]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#13131a] p-4">
      <h1 className="text-white text-3xl mb-4">Your Profile</h1>
      <div className="flex flex-wrap gap-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : userCampaigns.length > 0 ? (
          userCampaigns.map((campaign) => (
            <FundCard key={campaign.pId} {...campaign} />
          ))
        ) : (
          <p className="text-white">No campaigns found.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
