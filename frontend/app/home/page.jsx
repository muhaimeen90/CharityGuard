"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DisplayCampaigns from "../components/DisplayCampaigns";
import { useStateContext } from "../context/Campaign";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  //const [campaigns, setCampaigns] = useState([]);
  const { address, fetchCampaigns, campaigns } = useStateContext();
  const router = useRouter();

  const fetchAllCampaigns = async () => {
    setIsLoading(true);
    try {
      await fetchCampaigns();
      //setCampaigns(data);
      console.log(campaigns);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      // console.log(address);
      // console.log(campaigns);
      fetchAllCampaigns();
    }
  }, []);

  console.log(campaigns);
  return (
    <DisplayCampaigns
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  );
}
