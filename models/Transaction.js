const db = require("../connections/db");

class Transaction {
  static insert_query = `INSERT INTO transactions (amount, reason, date, category) VALUES (?, ?, ?, ?)`;
  static update_query = `UPDATE transactions SET amount = ?, reason = ?, date = ?, category = ? WHERE rowid = ?`;
  static get_all_query = `SELECT * FROM transactions`;
  static delete_query = `DELETE FROM transactions WHERE rowid = ?`;

  constructor(amount, reason, date, category, id = -1) {
    this.id = id;
    this.amount = amount;
    this.reason = reason;
    this.category = category;
    this.date = date;
  }

  insert_params() {
    return [this.amount, this.reason, this.date, this.category];
  }

  update_params() {
    return [this.amount, this.reason, this.date, this.category, this.id];
  }

  static async create_table(name) {
    const createQuery = `CREATE TABLE ${name} (rowid int NOT NULL AUTO_INCREMENT, amount int NOT NULL, reason varchar(50) NOT NULL, date char(10) NOT NULL, category varchar(20) NOT NULL, PRIMARY KEY (rowid))`;

    try {
      const result = await db.query(createQuery);
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
      throw new Error(
        "Server cannot process your request at this time. Please try again later"
      );
    }
  }
}

module.exports = Transaction;
