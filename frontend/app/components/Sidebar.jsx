"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { logo } from "../assets";
import { useStateContext } from "../context/Campaign";
import Image from "next/image";

// Import only the navigation links you want to keep
import { createCampaign, home, profile, notifications } from "../assets/index";

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
  <div
    className={`w-[48px] h-[48px] rounded-[10px] ${
      isActive && isActive === name && "bg-[#2c2f32]"
    } flex justify-center items-center ${
      !disabled && "cursor-pointer"
    } ${styles}`}
    onClick={handleClick}
  >
    {!isActive ? (
      // <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" />
      <Image src={imgUrl} alt="fund_logo" height={95} width={95} />
    ) : (
      <Image
        src={imgUrl}
        alt="fund_logo"
        className={`w-1/2 h-1/2 ${isActive !== name && "grayscale"}`}
      />
    )}
  </div>
);

const Sidebar = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { address } = useStateContext();
  const [isActive, setIsActive] = useState("home");

  // Define navlinks directly here instead of importing from constants
  // This way we exclude the logout option
  const sidebarLinks = [
    {
      name: "home",
      imgUrl: home,
      link: "/home",
    },
    {
      name: "campaign",
      imgUrl: createCampaign,
      link: "/create-campaign",
    },
    {
      name: "notifications",
      imgUrl: notifications,
      link: "/notifications",
    },
    {
      name: "profile",
      imgUrl: profile,
      link: "/profile",
    },
  ];

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      <Link href={address ? "/home" : "/"}>
        <Icon styles="w-[52px] h-[52px] bg-[#2c2f32]" imgUrl={logo} />
      </Link>

      <div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12">
        <div className="flex flex-col justify-center items-center gap-3">
          {sidebarLinks.map((link) => (
            <Icon
              key={link.name}
              {...link}
              isActive={isActive}
              handleClick={() => {
                if (!link.disabled) {
                  setIsActive(link.name);
                  router.push(link.link);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
