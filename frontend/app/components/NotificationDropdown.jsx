"use client";

import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

const NotificationDropdown = () => {
  const router = useRouter();
  const { 
    notifications, 
    unreadCount, 
    isOpen, 
    markAsRead,
    markAllAsRead
  } = useNotifications();

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-0 mt-2 w-80 bg-[#1c1c24] shadow-lg rounded-md overflow-hidden z-50">
      <div className="p-3 border-b border-gray-700 flex justify-between items-center">
        <h3 className="font-epilogue font-semibold text-white">
          Notifications {unreadCount > 0 && `(${unreadCount})`}
        </h3>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-[#1dc071] text-sm hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            No notifications
          </div>
        ) : (
          <ul>
            {notifications.map((notification) => (
              <li 
                key={notification.id} 
                className={`p-4 border-b border-gray-700 hover:bg-[#2c2f32] cursor-pointer ${!notification.isRead ? 'bg-[#2a2b32]' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start">
                  {!notification.isRead && (
                    <span className="h-2 w-2 rounded-full bg-[#1dc071] mt-2 mr-2 flex-shrink-0"></span>
                  )}
                  <div className="flex-1">
                    <p className="text-white text-sm">{notification.message}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="p-3 border-t border-gray-700 text-center">
        <button 
          onClick={() => {
            router.push('/notifications');
          }}
          className="text-[#1dc071] text-sm hover:underline"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;