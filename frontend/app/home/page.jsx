"use client";

import { useState, useEffect } from "react";
import DisplayCampaigns from "../components/DisplayCampaigns";
import { useStateContext } from "../context/Campaign";
import ProtectedRoute from "../components/ProtectedRoute";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [showEndedCampaigns, setShowEndedCampaigns] = useState(false); // State to toggle between active and inactive campaigns
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

  // Filter campaigns based on the state
  const filteredCampaigns = campaigns.filter((campaign) =>
    showEndedCampaigns ? !campaign.isActive : campaign.isActive
  );

  // Sort campaigns by ID
  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    if (b.id > a.id) return 1; // b comes first
    if (b.id < a.id) return -1; // a comes first
    return 0; // no change
  });

  return (
    <ProtectedRoute>
      <div className="flex justify-start mb-[35px]">
        <button
          onClick={() => setShowEndedCampaigns(!showEndedCampaigns)}
          className={`font-epilogue font-semibold text-[16px] min-h-[52px] px-4 rounded-full transition-all ${
            showEndedCampaigns
              ? "bg-[#1c1c24] text-[#1dc071] hover:bg-[#2c2f32]"
              : "bg-[#1dc071] text-white hover:bg-[#14a85d]"
          }`}
        >
          {showEndedCampaigns
            ? "Show Active Campaigns"
            : "Show Ended Campaigns"}
        </button>
      </div>
      <DisplayCampaigns
        title={showEndedCampaigns ? "Ended Campaigns" : "All Campaigns"}
        isLoading={isLoading}
        campaigns={sortedCampaigns}
      />
    </ProtectedRoute>
  );
}
