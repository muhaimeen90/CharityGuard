"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStateContext } from "../../context/Campaign";
import CountBox from "../../components/CountBox";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { daysLeft, weiToEth } from "../../utils";
import Loader from "../../components/Loader";
import Image from "next/image";
import { profile } from "../../assets";
import { jsPDF } from "jspdf";

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const {
    address,
    campaigns,
    donors,
    fetchDonors,
    recipients,
    fetchRecipients,
    contractAddress, // Add contractAddress from context
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

        const selectedCampaign = campaigns.find(
          (campaign) => BigInt(campaign[0]) === campaignId
        );

        if (selectedCampaign) {
          console.log("Selected Campaign:", selectedCampaign);
          setCampaign(selectedCampaign);

          await fetchDonors(campaignId);
          console.log("donors", donors);
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

  const generatePDF = (campaignTitle, ownerAddress) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Campaign Donors and Recipients", 10, 10);

    doc.setFontSize(12);
    doc.text(`Campaign Title: ${campaign.title}`, 10, 20);
    doc.text(`Owner Address: ${campaign.owner}`, 10, 30);
    doc.text(`Contract Address: ${contractAddress}`, 10, 40); // Add contract address

    doc.setFontSize(14);
    doc.text("Donors:", 10, 50); // Adjust yOffset
    let yOffset = 60;

    campaignDonors.forEach((donor, index) => {
      doc.setFontSize(12);

      doc.text(`${index + 1}.`, 10, yOffset);
      yOffset += 7;

      doc.text(`Address: ${donor.donorAddress}`, 15, yOffset);
      yOffset += 7;

      doc.text(`Amount: ${weiToEth(donor.amount)} ETH`, 15, yOffset);
      yOffset += 10;
    });

    doc.setFontSize(14);
    doc.text("Recipients:", 10, yOffset);
    yOffset += 10;

    campaignRecipients.forEach((recipient, index) => {
      doc.setFontSize(12);

      doc.text(`${index + 1}.`, 10, yOffset);
      yOffset += 7;

      doc.text(`Address: ${recipient.recipientAddress}`, 15, yOffset);
      yOffset += 7;

      doc.text(`Amount: ${weiToEth(recipient.amount)} ETH`, 15, yOffset);
      yOffset += 10;
    });

    doc.save("campaign_details.pdf");
  };

  if (!campaign) return <Loader />;

  return (
    <div className="p-6 bg-[#1c1c24] rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="mb-4">
          <p className="font-epilogue font-normal text-[16px] text-[#808191] break-all">
            <span className="font-semibold text-white">Contract Address:</span>{" "}
            <span className="text-blue-400">{contractAddress}</span>
          </p>
        </div>
        <button
          onClick={generatePDF}
          className="bg-[#4e44ce] text-white px-4 py-2 rounded-lg hover:bg-[#3a32a0] transition-all"
        >
          Download PDF
        </button>
      </div>

      <div className="mb-8">
        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase mb-4">
          Donators
        </h4>

        <div className="mt-[20px] flex flex-col gap-4">
          {campaignDonors.length > 0 ? (
            campaignDonors.map((donor, index) => (
              <div
                key={`${donor.donorAddress}-${index}`}
                className="flex justify-between items-center gap-4 p-4 bg-[#2c2f32] rounded-lg hover:bg-[#3a3d42] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#1c1c24] cursor-pointer"
                    onClick={() =>
                      router.push(`/user-profile/${donor.donorAddress}`)
                    }
                  >
                    <Image
                      src={profile}
                      alt="profile"
                      height={150}
                      width={150}
                      className="rounded-full"
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
                <div className="text-right">
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-all">
                    {weiToEth(donor.amount)} ETH
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-center py-6">
              No donators yet. Be the first one!
            </p>
          )}
        </div>
      </div>

      <div>
        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase mb-4">
          Recipients
        </h4>

        <div className="mt-[20px] flex flex-col gap-4">
          {campaignRecipients.length > 0 ? (
            campaignRecipients.map((recipient, index) => (
              <div
                key={`${recipient}-${index}`}
                className="flex justify-between items-center gap-4 p-4 bg-[#2c2f32] rounded-lg hover:bg-[#3a3d42] transition-all"
              >
                <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all">
                  {index + 1}. {recipient.recipientAddress}
                </p>
                <div className="text-right">
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-all">
                    {weiToEth(recipient.amount)} ETH
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-center py-6">
              The Campaign has not ended yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
