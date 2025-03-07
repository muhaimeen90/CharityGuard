"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStateContext } from "../context/Campaign";
import { navlinks } from "../constants";
import { search, profile } from "../assets";
import NotificationBell from "./NotificationBell";
import Image from "next/image";

const Navbar = () => {
  const { data: session, status } = useSession();
  const { connect, address } = useStateContext();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchUserInfo = async () => {
  //     if (session?.user) {
  //       console.log("session user data:", session.user); // Check session user data
  //       setUserInfo({
  //         id: session.user.id,
  //         email: session.user.email,
  //         role: session.user.role || "USER",
  //       });
  //     }
  //   };

  //   fetchUserInfo();
  // }, [session]);

  // useEffect(() => {
  //   console.log("User Info", userInfo);
  // }, [userInfo]);

  // //console.log("User Info", userInfo?.email);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     if (!userInfo?.email) {
  //       console.log("User Info", userInfo?.email);

  //       return;
  //     }
  //     console.log("User Info", userInfo?.email);
  //     setIsLoading(true);
  //     try {
  //       console.log(`Fetching user data for address: ${userInfo?.email}`);
  //       const response = await fetch(`/api/users/email/${userInfo?.email}`);

  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         console.error("Error response:", errorData);
  //         throw new Error(errorData.error || "Failed to fetch user data");
  //       }

  //       const data = await response.json();
  //       console.log("User data fetched:", data);
  //       setUserData(data);
  //     } catch (err) {
  //       console.error("Error fetching user data:", err);
  //       setError(err.message || "Failed to load user information");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchUserData();
  // }, [userInfo?.email]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      <div className="flex-.5"></div>

      {/* Centered Logo */}
      <div className="flex justify-center items-center flex-1">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <h1 className="text-2xl font-bold text-[#1dc071] hover:text-[#14a85d] transition-all">
              CharityGuard
            </h1>
          </div>
        </Link>
      </div>

      <div className="sm:flex h</div>idden flex-row justify-end gap-6 items-center">
        {status === "authenticated" && <NotificationBell />}

        <button
          className="font-epilogue font-semibold text-[16px] text-[#1dc071] min-h-[52px] px-4 rounded-full bg-[#1c1c24] hover:bg-[#2c2f32] transition-all"
          onClick={() => connect()}
        >
          {address ? "Connected" : "Connect"}
        </button>

        {status === "authenticated" ? (
          <button
            className="font-epilogue font-semibold text-[16px] text-white min-h-[52px] px-4 rounded-full bg-[#1dc071] hover:bg-[#14a85d] transition-all"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="font-epilogue font-semibold text-[16px] text-white min-h-[52px] px-4 rounded-full bg-[#1dc071] hover:bg-[#14a85d] transition-all flex items-center justify-center"
          >
            Login
          </Link>
        )}

        <Link href="/profile">
          <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
            <Image src={profile} alt="profile" height={150} width={150} />
          </div>
        </Link>
      </div>

      {/* Mobile menu */}
      {/* ... (existing mobile menu code) */}
    </div>
  );
};

export default Navbar;
