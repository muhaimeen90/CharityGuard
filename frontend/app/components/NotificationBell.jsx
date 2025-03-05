"use client";

import React, { useRef, useEffect } from "react";
import { useNotifications } from "../context/NotificationContext";
import NotificationDropdown from "./NotificationDropdown";
import { notifications as notificationIcon } from "../assets";
import Image from "next/image";

const NotificationBell = () => {
  const { unreadCount, isOpen, toggleNotifications } = useNotifications();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isOpen) toggleNotifications();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleNotifications]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#2c2f32] hover:bg-[#3a3a43]"
        onClick={toggleNotifications}
      >
        {/* <img 
          src={notificationIcon} 
          alt="Notifications" 
          className="w-5 h-5" 
        /> */}
        <Image
          src={notificationIcon}
          alt="Notification"
          height={25}
          width={25}
        />

        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center h-5 w-5 text-xs rounded-full bg-[#1dc071] text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <NotificationDropdown />
    </div>
  );
};

export default NotificationBell;
