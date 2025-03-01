import React from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid"; // Make sure uuid is installed: npm install uuid
import FundCard from "./FundCard";
import { loader } from "../assets";

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const router = useRouter();
  //console.log(campaigns);
  const handleNavigate = (campaign) => {
    console.log(campaign);
    router.push(`/campaign-details/${campaign.id}`, { state: campaign });
  };

  // Improved handling of campaigns:
  const campaignsToDisplay = campaigns; //|| []; // Use an empty array if campaigns is undefined

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        {title} ({campaignsToDisplay.length}) {/* Use the safe array */}
      </h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}

        {!isLoading &&
          campaignsToDisplay.length === 0 && ( // Use the safe array here too
            <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
              You have not created any campaigns yet
            </p>
          )}

        {!isLoading &&
          campaignsToDisplay.length > 0 && // And here
          campaignsToDisplay.map(
            (
              campaign // And here
            ) => (
              <FundCard
                key={uuidv4()}
                title={campaign.title} // Map to the correct property
                description={campaign.description}
                goal={campaign.goal}
                raised={campaign.raised}
                owner={campaign.owner}
                recipients={campaign.recipients}
                deadline={campaign.deadline}
                image={campaign.image}
                handleClick={() => handleNavigate(campaign)}
              />
            )
          )}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
