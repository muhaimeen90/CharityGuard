"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DisplayCampaigns from "../components/DisplayCampaigns";
import { useStateContext } from "../context/Campaign";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const { address, fetchCampaign } = useStateContext();
  const router = useRouter();

  const fetchAllCampaigns = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCampaign;
      setCampaigns(data);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      fetchAllCampaigns();
    } else {
      //router.push("/login");
    }
  }, [address, router]);

  return (
    <DisplayCampaigns
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  );
}
