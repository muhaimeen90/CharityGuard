"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DisplayCampaigns from "../components/DisplayCampaigns";
import { useStateContext } from "../context/Campaign";
import ProtectedRoute from "../components/ProtectedRoute";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const { address, fetchCampaign } = useStateContext();
  const { status } = useSession();

  const fetchAllCampaigns = async () => {
    setIsLoading(true);
    try {
      if (fetchCampaign) {
        const data = await fetchCampaign;
        setCampaigns(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      setCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchAllCampaigns();
    }
  }, [address, status]);

  return (
    <ProtectedRoute>
      <DisplayCampaigns
        title="All Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
      />
    </ProtectedRoute>
  );
}