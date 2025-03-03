"use client";

import React, { useEffect } from "react";
import { useNotifications } from "../context/NotificationContext";
import { formatDistanceToNow } from 'date-fns';
import ProtectedRoute from "../components/ProtectedRoute";

const getNotificationTypeStyle = (type) => {
  const styles = {
    DONATION: "bg-blue-500",
    CAMPAIGN_CREATED: "bg-green-500",
    CAMPAIGN_MILESTONE: "bg-yellow-500",
    CAMPAIGN_COMPLETE: "bg-purple-500",
    SYSTEM: "bg-gray-500"
  };
  
  return styles[type] || styles.SYSTEM;
};

const NotificationsPage = () => {
  const { notifications, markAsRead, fetchNotifications } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <ProtectedRoute>
      <div className="p-4">
        <h1 className="font-epilogue font-bold text-[30px] text-white mb-6">
          Notifications
        </h1>
        
        <div className="bg-[#1c1c24] rounded-[15px] p-6">
          {notifications.length === 0 ? (
            <div className="text-center py-10">
              <p className="font-epilogue text-[18px] text-[#808191]">No notifications yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 border-b border-[#3a3a43] ${!notification.isRead ? 'bg-[#2a2b32]' : ''} rounded-[10px]`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start">
                    {!notification.isRead && (
                      <div className="h-3 w-3 rounded-full bg-[#1dc071] mt-2 mr-3 flex-shrink-0"></div>
                    )}
                    <div className="flex-1">
                      <p className="font-epilogue text-white text-[16px]">
                        {notification.message}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="font-epilogue text-[#808191] text-[14px]">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                        <div className={`px-2 py-1 rounded-full ${getNotificationTypeStyle(notification.type)} text-white text-xs`}>
                          {notification.type || "SYSTEM"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default NotificationsPage;