const mssql = require("mssql");
const pool = require("../connections/db");

class Transaction {
  constructor(usid) {
    if (typeof usid !== "string") {
      throw new Error("tId must be a string.");
    }

    const specialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]+/;
    if (usid.match(specialChar) || usid.length != 15) {
      throw new Error("Invalid tId. Please check again.");
    }

    this.usid = usid;
  }

  async insert(cost, reason, date, category) {
    const insertQuery = `INSERT INTO transactions (usid, cost, reason, date, category) VALUES (@usid, @cost, @reason, @date, @category)`;

    const pool1 = await pool.connect();
    const request = new mssql.Request(pool1);

    var result = {};

    try {
      result = await request
        .input("usid", mssql.Char, this.usid)
        .input("cost", mssql.Int, cost)
        .input("reason", mssql.VarChar, reason)
        .input("date", mssql.Char, date)
        .input("category", mssql.VarChar, category)
        .query(insertQuery);
      console.log("Transaction added");
    } catch (error) {
      console.log(error);
      throw new Error("Server error. Please try again later");
    }

    return result.rowsAffected[0];
  }

  async update(cost, reason, date, category, id) {
    const updateQuery = `UPDATE transactions SET cost = @cost, reason = @reason, date = @date, category = @category WHERE rowid = @id and usid = @usid`;

    const pool1 = await pool.connect();
    const request = new mssql.Request(pool1);

    var result = {};

    try {
      result = await request
        .input("cost", mssql.Int, cost)
        .input("reason", mssql.VarChar, reason)
        .input("date", mssql.Char, date)
        .input("category", mssql.VarChar, category)
        .input("id", mssql.Int, id)
        .input("usid", mssql.Char, this.usid)
        .query(updateQuery);
      console.log("Transaction updated");
    } catch (error) {
      console.log(error);
      throw new Error("Server error. Please try again later");
    }

    return result.rowsAffected[0];
  }

  async getAll() {
    const getAllQuery = `SELECT * FROM transactions WHERE usid = @usid ORDER BY date DESC`;

    const pool1 = await pool.connect();
    const request = new mssql.Request(pool1);

    var result = {};

    try {
      result = await request
        .input("usid", mssql.Char, this.usid)
        .query(getAllQuery);
      console.log("Transaction fetched");
    } catch (error) {
      console.log(error);
      throw new Error("Server error. Please try again later");
    }

    return result.recordset;
  }

  async delete(id) {
    const deleteQuery = `DELETE FROM transactions WHERE rowid = @id AND usid = @usid`;

    const pool1 = await pool.connect();
    const request = new mssql.Request(pool1);

    var result = {};

    try {
      result = await request
        .input("id", mssql.Int, id)
        .input("usid", mssql.Char, this.usid)
        .query(deleteQuery);
      console.log("Transaction deleted");
    } catch (error) {
      console.log(error);
      throw new Error("Server error. Please try again later");
    }

    return result.rowsAffected[0];
  }
}

module.exports = Transaction;
