"use client";

import React from "react";

const NotificationsPage = () => {
  const notifications = [
    { id: 1, message: "Your donation to Campaign A was successful!" },
    { id: 2, message: "Campaign B has reached its funding goal." },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#13131a] p-4">
      <h1 className="text-white text-3xl mb-4">Notifications</h1>
      <div className="w-full max-w-md">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-[#1c1c24] p-4 rounded-lg mb-4"
          >
            <p className="text-white">{notification.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
