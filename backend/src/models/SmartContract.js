export class SmartContract {
    constructor(contractId) {
      this.contractId = contractId;
    }
  
    disburseFunds(amount) {
      console.log(`Disbursing ${amount} via contract ${this.contractId}`);
    }
  }