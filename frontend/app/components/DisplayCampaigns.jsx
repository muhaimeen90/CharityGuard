import React from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import FundCard from "./FundCard";
import { loader } from "../assets";

const DisplayCampaigns = ({ title, isLoading, campaigns = [] }) => {
  const router = useRouter();
  
  const handleNavigate = (campaign) => {
    console.log(campaign);
    router.push(`/campaign-details/${campaign.id}`);
  };

  // Ensure campaigns is an array even if undefined is passed
  const campaignsToDisplay = Array.isArray(campaigns) ? campaigns : [];

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
          campaignsToDisplay.map((campaign) => (
            <FundCard
              key={uuidv4()}
              title={campaign.title}
              description={campaign.description}
              goal={campaign.goal}
              raised={campaign.raised}
              owner={campaign.owner}
              recipients={campaign.recipients}
              deadline={campaign.deadline}
              image={campaign.image}
              handleClick={() => handleNavigate(campaign)}
            />
          ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;