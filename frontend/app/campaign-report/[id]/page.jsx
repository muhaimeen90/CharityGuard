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
import { jsPDF } from "jspdf";
//import

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const {
    address,
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

  const generatePDF = (campaignTitle, ownerAddress) => {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Add a title to the PDF
    doc.setFontSize(18);
    doc.text("Campaign Donors and Recipients", 10, 10);

    // Add campaign title and owner address
    doc.setFontSize(12);
    doc.text(`Campaign Title: ${campaign.title}`, 10, 20);
    doc.text(`Owner Address: ${campaign.owner}`, 10, 30);

    // Add donors section
    doc.setFontSize(14);
    doc.text("Donors:", 10, 40);
    let yOffset = 50; // Vertical offset for content

    campaignDonors.forEach((donor, index) => {
      doc.setFontSize(12);

      // Add donor number
      doc.text(`${index + 1}.`, 10, yOffset);
      yOffset += 7; // Move down for the next line

      // Add donor address
      doc.text(`Address: ${donor.donorAddress}`, 15, yOffset);
      yOffset += 7; // Move down for the next line

      // Add donor amount
      doc.text(`Amount: ${weiToEth(donor.amount)} ETH`, 15, yOffset);
      yOffset += 7; // Move down for the next line

      // Add donor transaction hash
      doc.text(`Tx Hash: ${donor.txHash}`, 15, yOffset);
      yOffset += 10; // Add extra space between donors
    });

    // Add recipients section
    doc.setFontSize(14);
    doc.text("Recipients:", 10, yOffset);
    yOffset += 10; // Move down for the next section

    campaignRecipients.forEach((recipient, index) => {
      doc.setFontSize(12);

      // Add recipient number
      doc.text(`${index + 1}.`, 10, yOffset);
      yOffset += 7; // Move down for the next line

      // Add recipient address
      doc.text(`Address: ${recipient.recipientAddress}`, 15, yOffset);
      yOffset += 7; // Move down for the next line

      // Add recipient amount
      doc.text(`Amount: ${weiToEth(recipient.amount)} ETH`, 15, yOffset);
      yOffset += 7; // Move down for the next line

      // Add recipient transaction hash
      doc.text(`Tx Hash: ${recipient.txHash}`, 15, yOffset);
      yOffset += 10; // Add extra space between recipients
    });

    // Save the PDF
    doc.save("campaign_details.pdf");
  };

  if (!campaign) return <Loader />;

  return (
    <div className="p-6 bg-[#1c1c24] rounded-lg shadow-lg">
      {/* Button to Generate PDF */}
      <div className="flex justify-end mb-6">
        <button
          onClick={generatePDF}
          className="bg-[#4e44ce] text-white px-4 py-2 rounded-lg hover:bg-[#3a32a0] transition-all"
        >
          Download PDF
        </button>
      </div>

      {/* Donators Section */}
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
                  {/* Clickable Image */}
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
                  <p className="font-epilogue font-normal text-[12px] text-[#808191] break-all">
                    Tx Hash: {donor.txHash}
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

      {/* Recipients Section */}
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
                  <p className="font-epilogue font-normal text-[12px] text-[#808191] break-all">
                    Tx Hash: {recipient.txHash}
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
