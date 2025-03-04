// "use client";

// import React, { useState, useEffect, use } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { useStateContext } from "../../context/Campaign";
// import CountBox from "../../components/CountBox";
// import CustomButton from "../../components/CustomButton";
// import FormField from "../../components/FormField";
// import { daysLeft, weiToEth } from "../../utils";

// export default function CampaignDetailsPage() {
//   const { id } = useParams();
//   const { address, donate, campaigns, donors, fetchDonors } = useStateContext();
//   const [campaign, setCampaign] = useState();
//   const [amount, setAmount] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [campaignDonors, setCampaignDonors] = useState([]);

//   const router = useRouter();
//   //console.log(address);
//   //console.log(campaigns);

//   useEffect(() => {
//     const fetchCampaignAndDonors = async () => {
//       setIsLoading(true);
//       try {
//         const campaignId = BigInt(id);

//         // Find the campaign in the campaigns array
//         const selectedCampaign = campaigns.find(
//           (campaign) => BigInt(campaign[0]) === campaignId
//         );

//         if (selectedCampaign) {
//           setCampaign(selectedCampaign);

//           // Fetch donors for the campaign
//           await fetchDonors(campaignId);

//           setCampaignDonors(donors); // Update state with fetched donors
//         } else {
//           console.error("Campaign not found");
//         }
//       } catch (error) {
//         console.error("Failed to fetch campaign or donors:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (address) {
//       fetchCampaignAndDonors();
//     } else {
//       alert("Please login to view campaign details");
//     }
//   }, [address, id, campaigns]);

//   console.log("Fetched Donors:", donors);

//   const handleDonate = async () => {
//     if (!amount) return alert("Please enter a donation amount");
//     try {
//       await donate(id, amount);
//       alert("Donation successful!");
//       router.refresh();
//     } catch (error) {
//       console.error("Failed to donate:", error);
//     }
//   };

//   console.log("Details");
//   console.log(campaign);
//   if (!campaign) return <div>Loading...</div>;
//   const remainingDays = daysLeft(campaign.deadline);

//   const isCampaignOwner = address === campaign.owner;

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-[#13131a] p-4">
//       <h1 className="text-white text-3xl mb-4">{campaign.title}</h1>
//       <div className="flex flex-wrap gap-4 mb-4">
//         <CountBox title="Amount Collected" value={weiToEth(campaign.raised)} />
//         <CountBox title="Target" value={weiToEth(campaign.goal)} />
//         <CountBox title="Days Left" value={remainingDays} />
//       </div>
//       <p className="text-white mb-4">{campaign.description}</p>
//       {!isCampaignOwner && (
//         <>
//           <FormField
//             labelName="Donation Amount"
//             placeholder="ETH 0.1"
//             inputType="text"
//             value={amount}
//             handleChange={(e) => setAmount(e.target.value)}
//           />
//           <CustomButton
//             btnType="button"
//             title="Donate"
//             styles="bg-[#8c6dfd] hover:bg-[#7b5de8] transition-all"
//             handleClick={handleDonate}
//           />
//         </>
//       )}

//       <div className="mt-8 w-full max-w-2xl">
//         <h2 className="text-white text-2xl mb-4">Donors</h2>
//         {campaignDonors.length > 0 ? (
//           <ul className="space-y-2">
//             {campaignDonors.map((donor, index) => (
//               <li key={index} className="text-white">
//                 <div className="flex justify-between">
//                   <span> {donor.donorAddress}</span>
//                   <span> {weiToEth(donor.amount)} ETH</span>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-white">No donors yet.</p>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStateContext } from "../../context/Campaign";
import CountBox from "../../components/CountBox";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { daysLeft, weiToEth } from "../../utils";
import Loader from "../../components/Loader"; // Assuming you have a Loader component
import { thirdweb } from "../../assets"; // Assuming you have the thirdweb logo

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

  const handleDonate = async () => {
    if (!amount) return alert("Please enter a donation amount");
    setIsLoading(true);
    try {
      await donate(id, amount);
      alert("Donation successful!");
      router.refresh();
    } catch (error) {
      console.error("Failed to donate:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!campaign) return <Loader />; // Show loader while loading

  const remainingDays = daysLeft(campaign.deadline);
  const isCampaignOwner =
    address.toLowerCase() === campaign.owner.toLowerCase();

  console.log("owner", campaign.owner);
  console.log("address", address);
  console.log("True naki false", isCampaignOwner);

  const isActive = true == campaign.isActive;

  return (
    <div>
      {isLoading && <Loader />}

      {/* Campaign Image and Progress Bar */}
      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img
            src={campaign.image}
            alt="campaign"
            className="w-full h-[410px] object-cover rounded-xl"
          />
          {/* <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div
              className="absolute h-full bg-[#4acd8d]"
              style={{
                width: `${(campaign.raised / campaign.goal) * 100}%`,
                maxWidth: "100%",
              }}
            ></div>
          </div> */}
        </div>

        {/* CountBoxes */}
        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Days Left" value={remainingDays} />
          <CountBox
            title={`Raised of ${weiToEth(campaign.goal)}`}
            value={weiToEth(campaign.raised)}
          />
          <CountBox title="Total Backers" value={campaignDonors.length} />
        </div>
      </div>

      {/* Campaign Details */}
      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        {/* Left Section */}
        <div className="flex-[2] flex flex-col gap-[40px]">
          {/* Creator Section */}
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Creator
            </h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img
                  src={thirdweb}
                  alt="user"
                  className="w-[60%] h-[60%] object-contain"
                />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">
                  {campaign.owner}
                </h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
                  10 Campaigns
                </p>
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Story
            </h4>

            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                {campaign.description}
              </p>
            </div>
          </div>

          {/* Donators Section */}
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Donators
            </h4>

            <div className="mt-[20px] flex flex-col gap-4">
              {campaignDonors.length > 0 ? (
                campaignDonors.map((donor, index) => (
                  <div
                    key={`${donor.donorAddress}-${index}`}
                    className="flex justify-between items-center gap-4"
                  >
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all">
                      {index + 1}. {donor.donorAddress}
                    </p>
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
                  No recipients specified.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1">
          {!isCampaignOwner && isActive && (
            <>
              <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                Fund
              </h4>

              <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
                <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
                  Fund the campaign
                </p>
                <div className="mt-[30px]">
                  <input
                    type="number"
                    placeholder="ETH 0.1"
                    step="0.01"
                    className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />

                  <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                    <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
                      Back it because you believe in it.
                    </h4>
                    <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
                      Support the project for no reward, just because it speaks
                      to you.
                    </p>
                  </div>

                  <CustomButton
                    btnType="button"
                    title="Fund Campaign"
                    styles="w-full bg-[#8c6dfd]"
                    handleClick={handleDonate}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
