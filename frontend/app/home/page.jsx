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
  }, []); // Only run once on mount, removing fetchCampaigns from dependencies

  //const activeCampaigns = campaigns.filter((campaign) => campaign.isActive);

  return (
    <ProtectedRoute>
      <DisplayCampaigns
        title="All Campaigns"
        isLoading={isLoading}
        //campaigns={activeCampaigns}
        campaigns={campaigns}
      />
    </ProtectedRoute>
  );
}
