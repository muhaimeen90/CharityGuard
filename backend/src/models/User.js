export class User {
  constructor({
    id,
    email,
    password,
    smartWalletAddress,
    role,
    isVerified = false
  }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.smartWalletAddress = smartWalletAddress;
    this.role = role;
    this.isVerified = isVerified;
  }
}