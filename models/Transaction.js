const db = require("../connections/db");

class Transaction {
  constructor(tId) {
    if (typeof tId !== "string") {
      throw new Error("tId must be a string.");
    }

    const specialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]+/;
    if (tId.match(specialChar)) {
      throw new Error("Invalid tId. Please check again.");
    }

    this.insertQuery = `INSERT INTO ${tId} (amount, reason, date, category) VALUES (?, ?, ?, ?)`;
    this.updateQuery = `UPDATE ${tId} SET amount = ?, reason = ?, date = ?, category = ? WHERE rowid = ?`;
    this.getAllQuery = `SELECT * FROM ${tId}`;
    this.deleteQuery = `DELETE FROM ${tId} WHERE rowid = ?`;
  }

  setDetails(amount, reason, date, category, id = -1) {
    this.id = id;
    this.amount = amount;
    this.reason = reason;
    this.category = category;
    this.date = date;
  }

  insertParams() {
    return [this.amount, this.reason, this.date, this.category];
  }

  updateParams() {
    return [this.amount, this.reason, this.date, this.category, this.id];
  }

  static async createTable(name) {
    const createQuery = `CREATE TABLE ${name} (rowid int NOT NULL AUTO_INCREMENT, amount int NOT NULL, reason varchar(50) NOT NULL, date char(10) NOT NULL, category varchar(20) NOT NULL, PRIMARY KEY (rowid))`;

    try {
      const result = await db.query(createQuery);
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
