"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Polling for new notifications
  useEffect(() => {
    let intervalId;
    
    if (session?.user) {
      // Initial fetch
      fetchNotifications();
      fetchUnreadCount();
      
      // Set up polling every 30 seconds
      intervalId = setInterval(() => {
        fetchNotifications();
        fetchUnreadCount();
      }, 30000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [session]);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    if (!session?.user?.accessToken) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        console.log("Fetched notifications:", data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    if (!session?.user?.accessToken) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/notifications/unread-count`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.count);
        console.log("Unread notifications count:", data.count);
      }
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    if (!session?.user?.accessToken) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`
        },
      });
      
      if (res.ok) {
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => 
            notification.id === id ? { ...notification, isRead: true } : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (!session?.user?.accessToken) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/notifications/read-all`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`
        },
      });
      
      if (res.ok) {
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => ({ ...notification, isRead: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  // Toggle notification dropdown
  const toggleNotifications = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      // Refresh notifications when opening the dropdown
      fetchNotifications();
    }
  };

  // Add manual notification (for testing)
  const addTestNotification = () => {
    const testNotification = {
      id: Date.now().toString(),
      message: "This is a test notification",
      type: "SYSTEM",
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [testNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        isOpen, 
        toggleNotifications, 
        markAsRead, 
        markAllAsRead,
        fetchNotifications,
        fetchUnreadCount,
        addTestNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);