import { User } from './User.js';

export class Charity extends User {
  constructor({ id, email, password, smartWalletAddress }) {
    super({ id, email, password, smartWalletAddress, role: 'CHARITY' });
    this.verified = false;
  }
}