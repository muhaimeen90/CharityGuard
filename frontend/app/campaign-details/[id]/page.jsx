"use client";

import React, { useState, useEffect, use } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStateContext } from "../../context/Campaign";
import CountBox from "../../components/CountBox";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { daysLeft, weiToEth } from "../../utils";

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const { address, donate, campaigns, donors, fetchDonors } = useStateContext();
  const [campaign, setCampaign] = useState();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [campaignDonors, setCampaignDonors] = useState([]);

  const router = useRouter();
  //console.log(address);
  //console.log(campaigns);

  useEffect(() => {
    const fetchCampaignAndDonors = async () => {
      setIsLoading(true);
      try {
        const campaignId = BigInt(id);

        // Find the campaign in the campaigns array
        const selectedCampaign = campaigns.find(
          (campaign) => BigInt(campaign[0]) === campaignId
        );

        if (selectedCampaign) {
          setCampaign(selectedCampaign);

          // Fetch donors for the campaign
          await fetchDonors(campaignId);

          setCampaignDonors(donors); // Update state with fetched donors
        } else {
          console.error("Campaign not found");
        }
      } catch (error) {
        console.error("Failed to fetch campaign or donors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (address) {
      fetchCampaignAndDonors();
    } else {
      alert("Please login to view campaign details");
    }
  }, [address, id, campaigns]);

  console.log("Fetched Donors:", donors);

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

      <div className="mt-8 w-full max-w-2xl">
        <h2 className="text-white text-2xl mb-4">Donors</h2>
        {campaignDonors.length > 0 ? (
          <ul className="space-y-2">
            {campaignDonors.map((donor, index) => (
              <li key={index} className="text-white">
                <div className="flex justify-between">
                  <span> {donor.donorAddress}</span>
                  <span> {weiToEth(donor.amount)} ETH</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white">No donors yet.</p>
        )}
      </div>
    </div>
  );
}
