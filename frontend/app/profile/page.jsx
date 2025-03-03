"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useStateContext } from "../context/Campaign";
import DisplayCampaigns from "../components/DisplayCampaigns";
import ProtectedRoute from "../components/ProtectedRoute";
import CustomButton from "../components/CustomButton";

const ProfilePage = () => {
  const { data: session } = useSession();
  const { address, getUserCampaigns, userCampaigns } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserCampaigns = async () => {
      setIsLoading(true);
      try {
        await getUserCampaigns();
      } catch (error) {
        console.error("Failed to fetch user campaigns:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserInfo = async () => {
      if (session?.user) {
        // In a real app, you might want to fetch more user details from your backend
        setUserInfo({
          id: session.user.id,
          email: session.user.email,
          role: session.user.role || "USER",
        });
      }
    };

    if (address) fetchUserCampaigns();
    fetchUserInfo();
  }, [address, session]);

  return (
    <ProtectedRoute>
      <div className="flex flex-col">
        {/* User Profile Card */}
        <div className="bg-[#1c1c24] rounded-[20px] p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Picture */}
            <div className="w-[120px] h-[120px] rounded-full bg-[#2c2f32] flex items-center justify-center">
              <img 
                src="/images/profile.svg" 
                alt="profile" 
                className="w-1/2 h-1/2 object-contain"
              />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="font-epilogue font-bold text-[24px] text-white">
                {userInfo?.email || "User"}
              </h2>
              <p className="mt-1 font-epilogue text-[#808191]">
                Role: <span className="text-white">{userInfo?.role || "N/A"}</span>
              </p>
              <p className="mt-1 font-epilogue text-[#808191]">
                Wallet: <span className="text-white break-all">{address || "Not connected"}</span>
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <CustomButton 
                  btnType="button"
                  title="Edit Profile"
                  styles="bg-[#1dc071] hover:bg-[#14a85d]"
                  handleClick={() => alert("Edit profile functionality coming soon!")}
                />
                <CustomButton 
                  btnType="button"
                  title="Create Campaign"
                  styles="bg-[#8c6dfd] hover:bg-[#7b5de8]"
                  handleClick={() => router.push('/create-campaign')}
                />
              </div>
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
            <h3 className="font-epilogue font-semibold text-[18px] text-white">0</h3>
            <p className="font-epilogue text-[#808191]">Campaigns Funded</p>
          </div>
          
          <div className="bg-[#1c1c24] rounded-[15px] p-4">
            <h3 className="font-epilogue font-semibold text-[18px] text-white">0 ETH</h3>
            <p className="font-epilogue text-[#808191]">Total Donations</p>
          </div>
        </div>

        {/* User Campaigns */}
        <DisplayCampaigns
          title="Your Campaigns"
          isLoading={isLoading}
          campaigns={userCampaigns}
        />
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;