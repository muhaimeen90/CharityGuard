"use client";

import React, { useState, useEffect } from "react";
import { useStateContext } from "../context/Campaign";
import DisplayCampaigns from "../components/DisplayCampaigns";
const ProfilePage = () => {
  const { address, getUserCampaigns, userCampaigns } = useStateContext();
  //const [userCampaigns, setUserCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserCampaigns = async () => {
      setIsLoading(true);
      try {
        await getUserCampaigns();
        //console.log("Campaigns:", campaigns);
        //setUserCampaigns(campaigns);
      } catch (error) {
        console.error("Failed to fetch user campaigns:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (address) fetchUserCampaigns();
  }, [address]);

  //console.log("User Campaigns:", userCampaigns);

  return (
    <DisplayCampaigns
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={userCampaigns}
    />
  );
};

export default ProfilePage;
