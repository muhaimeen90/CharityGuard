import React from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import FundCard from "./FundCard";
import loader from "../assets/loader.svg";
import { weiToEth } from "../utils";

const DisplayCampaigns = ({ title, isLoading, campaigns = [] }) => {
  const router = useRouter();

  const handleNavigate = (campaign) => {
    router.push(`/campaign-details/${campaign.id}`);
  };

  // Ensure campaigns is an array even if undefined is passed
  const campaignsToDisplay = Array.isArray(campaigns) ? campaigns : [];

  const processCampaign = (campaign, index) => {
    // Check if campaign is array-like (from smart contract)
    if (
      Array.isArray(campaign) ||
      (campaign && typeof campaign === "object" && campaign[0] !== undefined)
    ) {
      return {
        id: campaign[0]?.toString() || `${index}`,
        title: campaign[1] || "Untitled Campaign",
        description: campaign[2] || "No description",
        goal: campaign[3] || "0",
        raised: campaign[4] || "0",
        owner: campaign[5] || "Unknown",
        isActive: campaign[6] !== undefined ? campaign[6] : true,
        recipients: campaign[7] || [],
        deadline: campaign[8] ? Number(campaign[8]) : Date.now() + 86400000,
        image: campaign[9] || "https://via.placeholder.com/150",
      };
    }

    // If campaign is object-like (already processed)
    return {
      id: campaign.id?.toString() || `${index}`,
      title: campaign.title || "Untitled Campaign",
      description: campaign.description || "No description",
      goal: campaign.goal || "0",
      raised: campaign.raised || "0",
      owner: campaign.owner || "Unknown",
      isActive: campaign.isActive !== undefined ? campaign.isActive : true,
      recipients: campaign.recipients || [],
      deadline: campaign.deadline
        ? Number(campaign.deadline)
        : Date.now() + 86400000,
      image: campaign.image || "https://via.placeholder.com/150",
    };
  };

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        {title} ({campaignsToDisplay.length})
      </h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}

        {!isLoading && campaignsToDisplay.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            No campaigns found
          </p>
        )}

        {!isLoading &&
          campaignsToDisplay.length > 0 &&
          campaignsToDisplay.map((campaign, index) => {
            const campaignData = processCampaign(campaign, index);

            return (
              <FundCard
                key={uuidv4()}
                title={campaignData.title}
                description={campaignData.description}
                goal={weiToEth(campaignData.goal)}
                raised={weiToEth(campaignData.raised)}
                owner={campaignData.owner}
                recipients={campaignData.recipients}
                deadline={campaignData.deadline}
                image={campaignData.image}
                handleClick={() => handleNavigate(campaignData)}
              />
            );
          })}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
