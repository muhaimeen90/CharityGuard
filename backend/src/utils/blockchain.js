export class Blockchain {
    static transactions = [];
  
    static addTransaction(transaction) {
      this.transactions.push(transaction);
      console.log(`Transaction ${transaction.id} added to blockchain`);
    }
  }