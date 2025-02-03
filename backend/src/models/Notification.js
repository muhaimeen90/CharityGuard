export class Notification {
    constructor({ userId, type, message }) {
      this.userId = userId;
      this.type = type;
      this.message = message;
      this.timestamp = new Date();
    }
  
    send() {
      console.log(`Notification sent to user ${this.userId}: [${this.type}] ${this.message}`);
    }
  }