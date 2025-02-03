export class NotificationService {
    static sendNotification(userId, type, message) {
      const notification = new Notification({ userId, type, message });
      notification.send();
    }
  }