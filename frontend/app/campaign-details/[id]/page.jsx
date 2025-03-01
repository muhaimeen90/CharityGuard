"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStateContext } from "../../context/Campaign";
import CountBox from "../../components/CountBox";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const { address, donate, getCampaigns } = useStateContext();
  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCampaign = async () => {
      setIsLoading(true);
      try {
        const campaigns = await getCampaigns();
        const selectedCampaign = campaigns.find(
          (campaign) => campaign.pId === parseInt(id)
        );
        setCampaign(selectedCampaign);
      } catch (error) {
        console.error("Failed to fetch campaign:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (address) fetchCampaign();
    //     else router.push("/login");
    //   }, [address, id, router, getCampaigns]);
    else alert("Please login to view campaign details");
  }, [address, id, router, getCampaigns]);

  const handleDonate = async () => {
    if (!amount) return alert("Please enter a donation amount");
    try {
      await donate(id, amount);
      alert("Donation successful!");
      router.push("/home");
    } catch (error) {
      console.error("Failed to donate:", error);
    }
  };

  if (!campaign) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#13131a] p-4">
      <h1 className="text-white text-3xl mb-4">{campaign.title}</h1>
      <div className="flex flex-wrap gap-4 mb-4">
        <CountBox title="Amount Collected" value={campaign.amountCollected} />
        <CountBox title="Target" value={campaign.target} />
        <CountBox title="Days Left" value={campaign.deadline} />
      </div>
      <p className="text-white mb-4">{campaign.description}</p>
      <FormField
        labelName="Donation Amount"
        placeholder="ETH 0.1"
        inputType="text"
        value={amount}
        handleChange={(e) => setAmount(e.target.value)}
      />
      <CustomButton
        btnType="button"
        title="Donate"
        styles="bg-[#8c6dfd] hover:bg-[#7b5de8] transition-all"
        handleClick={handleDonate}
      />
    </div>
  );
}
