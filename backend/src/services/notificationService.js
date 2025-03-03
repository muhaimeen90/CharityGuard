import { Notification } from "../models/Notification.js";

export class NotificationService {
  static async createNotification(userId, type, message, data = {}) {
    const notification = new Notification({ userId, type, message, data });
    return await notification.save();
  }

  static async getUserNotifications(userId) {
    return await Notification.getUserNotifications(userId);
  }

  static async markAsRead(id) {
    return await Notification.markAsRead(id);
  }

  static async markAllAsRead(userId) {
    return await Notification.markAllAsRead(userId);
  }

  static async getUnreadCount(userId) {
    return await Notification.getUnreadCount(userId);
  }

  // Helper methods for common notification types
  static async notifyDonationMade(userId, campaignTitle, amount) {
    return await this.createNotification(
      userId,
      'DONATION',
      `You donated ${amount} ETH to campaign "${campaignTitle}"`,
      { campaignTitle, amount }
    );
  }
  
  static async notifyCampaignMilestone(userId, campaignTitle, milestone) {
    return await this.createNotification(
      userId,
      'CAMPAIGN_MILESTONE',
      `Campaign "${campaignTitle}" has reached ${milestone}% of its goal!`,
      { campaignTitle, milestone }
    );
  }
  
  static async notifyCampaignComplete(userId, campaignTitle) {
    return await this.createNotification(
      userId,
      'CAMPAIGN_COMPLETE',
      `Campaign "${campaignTitle}" has been fully funded!`,
      { campaignTitle }
    );
  }
  
  static async notifyCampaignCreated(userId, campaignTitle) {
    return await this.createNotification(
      userId,
      'CAMPAIGN_CREATED',
      `Your campaign "${campaignTitle}" has been created successfully!`,
      { campaignTitle }
    );
  }
}