"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStateContext } from "../../context/Campaign";
import CountBox from "../../components/CountBox";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { daysLeft, weiToEth } from "../../utils";
import Loader from "../../components/Loader"; // Assuming you have a Loader component
import Image from "next/image";
import { profile } from "../../assets"; // Assuming you have the thirdweb logo

//import

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const {
    address,
    donate,
    campaigns,
    donors,
    fetchDonors,
    recipients,
    fetchRecipients,
  } = useStateContext();
  const [campaign, setCampaign] = useState();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [campaignDonors, setCampaignDonors] = useState([]);
  const [campaignRecipients, setCampaignRecipients] = useState([]);

  const router = useRouter();

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
          console.log("Selected Campaign:", selectedCampaign);
          setCampaign(selectedCampaign);

          // Fetch donors for the campaign
          await fetchDonors(campaignId);

          setCampaignDonors(donors);

          if (selectedCampaign.isActive === false) {
            await fetchRecipients(campaignId);
            setCampaignRecipients(recipients);
          }
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

  if (!campaign) return <Loader />;

  return (
    <div>
      <div>
        <div>
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
            Donators
          </h4>

          <div className="mt-[20px] flex flex-col gap-4">
            {campaignDonors.length > 0 ? (
              campaignDonors.map((donor, index) => (
                <div
                  key={`${donor.donorAddress}-${index}`}
                  className="flex justify-between items-center gap-4 cursor-pointer hover:bg-[#2a2a35] p-2 rounded-lg transition-all"
                  onClick={() =>
                    router.push(`/user-profile/${donor.donorAddress}`)
                  }
                >
                  <div className="flex items-center gap-4">
                    <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32]">
                      <Image
                        src={profile}
                        alt="profile"
                        height={150}
                        width={150}
                      />
                    </div>
                    <div>
                      <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all">
                        {index + 1}. {donor.donorAddress}
                      </p>
                      <p className="font-epilogue font-normal text-[12px] text-[#808191]">
                        View donor profile
                      </p>
                    </div>
                  </div>
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-all">
                    {weiToEth(donor.amount)} ETH
                  </p>
                </div>
              ))
            ) : (
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                No donators yet. Be the first one!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recipients Section */}
      <div>
        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
          Recipients
        </h4>

        <div className="mt-[20px] flex flex-col gap-4">
          {campaignRecipients.length > 0 ? (
            campaignRecipients.map((recipient, index) => (
              <div
                key={`${recipient}-${index}`}
                className="flex justify-between items-center gap-4"
              >
                <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all">
                  {index + 1}. {recipient.recipientAddress}
                </p>
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-all">
                  {weiToEth(recipient.amount)} ETH
                </p>
              </div>
            ))
          ) : (
            <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
              The Campaign has not ended yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
