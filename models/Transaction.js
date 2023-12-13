const db = require("../connections/db");

class Transaction {
  static insert_query = `INSERT INTO transactions (amount, reason, date) VALUES (?, ?, ?)`;
  static update_query = `UPDATE transactions SET amount = ?, reason = ?, date = ? WHERE rowid = ?`;
  static get_all_query = `SELECT * FROM transactions`;
  static delete_query = `DELETE FROM transactions WHERE rowid = ?`;

  constructor(amount, reason, date, id = -1) {
    this.id = id;
    this.amount = amount;
    this.reason = reason;
    this.date = date;
  }

  insert_params() {
    return [this.amount, this.reason, this.date];
  }

  update_params() {
    return [this.amount, this.reason, this.date, this.id];
  }
}

module.exports = Transaction;
