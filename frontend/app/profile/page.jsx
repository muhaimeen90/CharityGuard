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
import { add } from "date-fns";

const ProfilePage = () => {
  const { data: session } = useSession();
  const {
    address,
    getUserCampaigns,
    userCampaigns,
    campaignsDonatedTo,
    donatedCampaigns,
    isLoading: contextLoading,
  } = useStateContext();
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [usersCampaigns, setUsersCampaigns] = useState([]); // Use state for campaigns
  const [usersDonatedCampaigns, setUsersDonatedCampaigns] = useState([]); // Use state for donated campaigns
  const router = useRouter();

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

  useEffect(() => {
    const loadUserCampaigns = async () => {
      if (address && userInfo?.role) {
        setIsLoading(true);
        try {
          if (userInfo.role == "CHARITY") {
            await getUserCampaigns();
            await campaignsDonatedTo(address);
            setUsersDonatedCampaigns(donatedCampaigns || []);

            setUsersCampaigns(userCampaigns || []); // Ensure userCampaigns is not undefined
          } else if (userInfo.role == "DONOR") {
            await campaignsDonatedTo(address);
            setUsersDonatedCampaigns(donatedCampaigns || []); // Ensure donatedCampaigns is not undefined
          } else {
            await getUserCampaigns();
            await campaignsDonatedTo(address);
            setUsersDonatedCampaigns(donatedCampaigns || []);
            setUsersCampaigns(userCampaigns || []); // Ensure userCampaigns is not undefined
          }
        } catch (error) {
          console.error("Failed to fetch user campaigns:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadUserCampaigns();
  }, [address, userInfo]); // Add dependencies

  // console.log("User campaigns:", usersCampaigns);
  // console.log("user info", userInfo);

  return (
    <ProtectedRoute>
      <div className="flex flex-col">
        {/* User Profile Card */}
        <div className="bg-[#1c1c24] rounded-[20px] p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Picture */}
            <div className="w-[120px] h-[120px] rounded-full bg-[#2c2f32] flex items-center justify-center">
              {/* <img
                src="/images/profile.svg"
                alt="profile"
                className="w-1/2 h-1/2 object-contain"
              /> */}
              <Image src={profile} alt="profile" height={150} width={150} />
            </div>

            {/* User Info */}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1c1c24] rounded-[15px] p-4">
            <h3 className="font-epilogue font-semibold text-[18px] text-white">
              {userCampaigns?.length || 0}
            </h3>
            <p className="font-epilogue text-[#808191]">Campaigns Created</p>
          </div>

          <div className="bg-[#1c1c24] rounded-[15px] p-4">
            <h3 className="font-epilogue font-semibold text-[18px] text-white">
              {usersDonatedCampaigns?.length || 0}
            </h3>
            <p className="font-epilogue text-[#808191]">Campaigns Funded</p>
          </div>

          <div className="bg-[#1c1c24] rounded-[15px] p-4">
            <h3 className="font-epilogue font-semibold text-[18px] text-white">
              0 ETH
            </h3>
            <p className="font-epilogue text-[#808191]">Total Donations</p>
          </div>
        </div>

        {/* User Campaigns */}
        {isLoading || contextLoading ? (
          <Loader />
        ) : (
          userInfo?.role !== "DONOR" && (
            <DisplayCampaigns
              title="Your Campaigns"
              isLoading={false}
              campaigns={usersCampaigns}
            />
          )
        )}
        {isLoading || contextLoading ? (
          <Loader />
        ) : (
          <DisplayCampaigns
            title="Your Donated Campaigns"
            isLoading={false}
            campaigns={usersDonatedCampaigns}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
