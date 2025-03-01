"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStateContext } from "../../context/Campaign";
import CountBox from "../../components/CountBox";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { daysLeft, weiToEth } from "../../utils";

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const { address, donate, campaigns } = useStateContext();
  const [campaign, setCampaign] = useState();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  //console.log(address);
  console.log(campaigns);

  useEffect(() => {
    const fetchCampaign = async () => {
      setIsLoading(true);
      try {
        // Convert the id from the URL to a BigInt (since the campaign id is stored as a BigInt)
        const campaignId = BigInt(id);

        // Find the campaign in the campaigns array
        const selectedCampaign = campaigns.find(
          (campaign) => BigInt(campaign[0]) === campaignId
        );

        console.log("Selected Campaign:", selectedCampaign);

        if (selectedCampaign) {
          setCampaign(selectedCampaign);
        } else {
          console.error("Campaign not found");
        }
      } catch (error) {
        console.error("Failed to fetch campaign:", error);
      } finally {
        setIsLoading(false);
      }
    };
    //console.log(address);
    if (address) fetchCampaign();
    //     else router.push("/login");
    //   }, [address, id, router, getCampaigns]);
    else alert("Please login to view campaign details");
  }, [address, id, router, campaign]);

  const handleDonate = async () => {
    if (!amount) return alert("Please enter a donation amount");
    try {
      await donate(id, amount);
      alert("Donation successful!");
      router.refresh();
    } catch (error) {
      console.error("Failed to donate:", error);
    }
  };

  console.log("Details");
  console.log(campaign);
  if (!campaign) return <div>Loading...</div>;
  const remainingDays = daysLeft(campaign.deadline);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#13131a] p-4">
      <h1 className="text-white text-3xl mb-4">{campaign.title}</h1>
      <div className="flex flex-wrap gap-4 mb-4">
        <CountBox title="Amount Collected" value={weiToEth(campaign.raised)} />
        <CountBox title="Target" value={weiToEth(campaign.goal)} />
        <CountBox title="Days Left" value={remainingDays} />
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
