import { NotificationService } from '../services/notificationService.js';

export class NotificationController {
  static async getUserNotifications(req, res) {
    try {
      const userId = req.user.id;
      const notifications = await NotificationService.getUserNotifications(userId);
      res.status(200).json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  }

  static async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      const count = await NotificationService.getUnreadCount(userId);
      res.status(200).json({ count });
    } catch (error) {
      console.error("Error counting unread notifications:", error);
      res.status(500).json({ error: 'Failed to count unread notifications' });
    }
  }
  static async createNotification(req, res) {
    try {
      const userId = req.user.id;
      const { type, message, data } = req.body;
      
      if (!type || !message) {
        return res.status(400).json({ error: 'Type and message are required' });
      }
      
      const notification = await NotificationService.createNotification(
        userId, 
        type, 
        message, 
        data || {}
      );
      
      res.status(201).json(notification);
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ error: 'Failed to create notification' });
    }
  }

  static async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const notification = await NotificationService.markAsRead(id);
      
      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      
      res.status(200).json(notification);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  }

  static async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;
      await NotificationService.markAllAsRead(userId);
      res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ error: 'Failed to mark all notifications as read' });
    }
  }
}