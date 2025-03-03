import prisma from "../config/prisma.js";

export class Notification {
  constructor({ userId, type, message, data = {} }) {
    this.userId = userId;
    this.type = type;
    this.message = message;
    this.data = data;
    this.timestamp = new Date();
  }

  async save() {
    try {
      const notification = await prisma.notification.create({
        data: {
          message: this.message,
          userId: this.userId,
          type: this.type,
          isRead: false,
          data: this.data
        }
      });
      
      return notification;
    } catch (error) {
      console.error("Failed to save notification:", error);
      throw error;
    }
  }

  static async markAsRead(id) {
    try {
      return await prisma.notification.update({
        where: { id },
        data: { isRead: true }
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      throw error;
    }
  }

  static async markAllAsRead(userId) {
    try {
      return await prisma.notification.updateMany({
        where: { 
          userId,
          isRead: false
        },
        data: { isRead: true }
      });
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      throw error;
    }
  }

  static async getUserNotifications(userId) {
    try {
      return await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50
      });
    } catch (error) {
      console.error("Failed to get user notifications:", error);
      throw error;
    }
  }

  static async getUnreadCount(userId) {
    try {
      return await prisma.notification.count({
        where: { 
          userId,
          isRead: false
        }
      });
    } catch (error) {
      console.error("Failed to count unread notifications:", error);
      throw error;
    }
  }
}