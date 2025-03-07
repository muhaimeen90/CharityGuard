"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useStateContext } from "../context/Campaign";
import DisplayCampaigns from "../components/DisplayCampaigns";
import ProtectedRoute from "../components/ProtectedRoute";
import CustomButton from "../components/CustomButton";
import Loader from "../components/Loader";
import Image from "next/image";
import { profile } from "../assets";

const ProfilePage = () => {
  const { data: session } = useSession();
  const {
    address,
    getUserCampaigns,
    campaignsDonatedTo,
    isLoading: contextLoading,
  } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [usersCampaigns, setUsersCampaigns] = useState([]);
  const [usersDonatedCampaigns, setUsersDonatedCampaigns] = useState([]);
  const router = useRouter();
  const [showCreated, setShowCreated] = useState(false);
  const [showDonated, setShowDonated] = useState(false);
  const [donationsTotal, setDonationsTotal] = useState(0);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (session?.user) {
        setUserInfo({
          id: session.user.id,
          email: session.user.email,
          role: session.user.role || "USER",
        });
      }
    };

    fetchUserInfo();
  }, [session]);

  const handleShowCreated = async () => {
    setIsLoading(true);
    try {
      if (address && userInfo?.role && userInfo.role !== "DONOR") {
        const fetchedCampaigns = await getUserCampaigns();
        const uniqueCampaigns = filterUniqueCampaigns(fetchedCampaigns);

        setUsersCampaigns(uniqueCampaigns || []);
      }
      setShowCreated(true);
      setShowDonated(false);
    } catch (error) {
      console.error("Failed to load user campaigns:", error);
      setUsersCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowDonated = async () => {
    setIsLoading(true);
    try {
      if (address) {
        const fetchedDonatedCampaigns = await campaignsDonatedTo(address);

        const uniqueCampaigns = filterUniqueCampaigns(fetchedDonatedCampaigns);

        setUsersDonatedCampaigns(uniqueCampaigns || []);
      }
      setShowDonated(true);
      setShowCreated(false);
      let total = 0;

      setDonationsTotal(total.toFixed(2));
    } catch (error) {
      console.error("Failed to load donated campaigns:", error);
      setUsersDonatedCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUniqueCampaigns = (campaigns) => {
    const uniqueCampaigns = [];
    const seenCampaigns = new Set();

    campaigns.forEach((campaign) => {
      const campaignId = campaign[0];
      if (!seenCampaigns.has(campaignId)) {
        seenCampaigns.add(campaignId);
        uniqueCampaigns.push(campaign);
      }
    });

    return uniqueCampaigns;
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col">
        {/* User Profile Card */}
        <div className="bg-[#1c1c24] rounded-[20px] p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-[120px] h-[120px] rounded-full bg-[#2c2f32] flex items-center justify-center">
              <Image src={profile} alt="profile" height={150} width={150} />
            </div>
            <div className="flex-1">
              <h2 className="font-epilogue font-bold text-[24px] text-white">
                {userInfo?.email || "User"}
              </h2>
              <p className="mt-1 font-epilogue text-[#808191]">
                Role:{" "}
                <span className="text-white">{userInfo?.role || "N/A"}</span>
              </p>
              <p className="mt-1 font-epilogue text-[#808191]">
                Wallet:{" "}
                <span className="text-white break-all">
                  {address || "Not connected"}
                </span>
              </p>
              {userInfo?.role !== "DONOR" && (
                <div className="mt-4 flex flex-wrap gap-3">
                  <CustomButton
                    btnType="button"
                    title="Create Campaign"
                    styles="bg-[#8c6dfd] hover:bg-[#7b5de8]"
                    handleClick={() => router.push("/create-campaign")}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {userInfo?.role !== "DONOR" && (
            <div className="bg-[#1c1c24] rounded-[15px] p-4">
              <h3 className="font-epilogue font-semibold text-[18px] text-white">
                {usersCampaigns?.length || 0}
              </h3>
              <p className="font-epilogue text-[#808191]">Campaigns Created</p>
            </div>
          )}
          <div className="bg-[#1c1c24] rounded-[15px] p-4">
            <h3 className="font-epilogue font-semibold text-[18px] text-white">
              {usersDonatedCampaigns?.length || 0}
            </h3>
            <p className="font-epilogue text-[#808191]">Campaigns Funded</p>
          </div>
          <div className="bg-[#1c1c24] rounded-[15px] p-4">
            
            <h3 className="font-epilogue font-semibold text-[18px] text-white">{donationsTotal} ETH</h3>
            <p className="font-epilogue text-[#808191]">Total Donations</p>
          </div>
        </div> */}

        {/* Buttons to show created/donated campaigns */}
        <div className="flex justify-center gap-4 mb-8">
          {userInfo?.role !== "DONOR" && (
            <button
              className="font-epilogue font-semibold text-[16px] text-white min-h-[52px] px-6 rounded-full bg-[#1dc071] hover:bg-[#14a85d] transition-all"
              onClick={handleShowCreated}
            >
              Created Campaigns
            </button>
          )}
          <button
            className="font-epilogue font-semibold text-[16px] text-white min-h-[52px] px-6 rounded-full bg-[#8c6dfd] hover:bg-[#7b5de8] transition-all"
            onClick={handleShowDonated}
          >
            Donated Campaigns
          </button>
        </div>

        {/* User Campaigns */}
        {isLoading || contextLoading ? (
          <Loader />
        ) : (
          <>
            {showCreated && (
              <DisplayCampaigns
                title="Your Campaigns"
                isLoading={false}
                campaigns={usersCampaigns}
              />
            )}
            {showDonated && (
              <DisplayCampaigns
                title="Your Donated Campaigns"
                isLoading={false}
                campaigns={usersDonatedCampaigns}
              />
            )}
          </>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
