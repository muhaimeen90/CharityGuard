"use client";

import { useState, useEffect } from "react";
import DisplayCampaigns from "../components/DisplayCampaigns";
import { useStateContext } from "../context/Campaign";
import ProtectedRoute from "../components/ProtectedRoute";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const { campaigns, fetchCampaigns } = useStateContext();

  // Fetch campaigns only once on component mount
  useEffect(() => {
    const loadCampaigns = async () => {
      setIsLoading(true);
      try {
        await fetchCampaigns();
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  //const activeCampaigns = campaigns.filter((campaign) => campaign.isActive);
  const sortedCampaigns = [...campaigns].sort((a, b) => {
    if (b.id > a.id) return 1; // b comes first
    if (b.id < a.id) return -1; // a comes first
    return 0; // no change
  });

  return (
    <ProtectedRoute>
      <DisplayCampaigns
        title="All Campaigns"
        isLoading={isLoading}
        //campaigns={activeCampaigns}
        campaigns={sortedCampaigns}
      />
    </ProtectedRoute>
  );
}
