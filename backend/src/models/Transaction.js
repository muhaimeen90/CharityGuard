import { Blockchain } from '../utils/blockchain.js';

export class Transaction {
  constructor({ amount, donorId, campaignId }) {
    this.id = `TX-${Date.now()}`;
    this.amount = amount;
    this.donorId = donorId;
    this.campaignId = campaignId;
    this.status = 'PENDING';
  }

  processTransaction() {
    this.status = 'PROCESSING';
    Blockchain.addTransaction(this);
    this.status = 'COMPLETED';
  }
}