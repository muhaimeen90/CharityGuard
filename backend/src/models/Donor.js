import { User } from './User.js';

export class Donor extends User {
  constructor({ id, email, password, smartWalletAddress }) {
    super({ id, email, password, smartWalletAddress, role: 'DONOR' });
  }
}