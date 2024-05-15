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

  async insert(amount, reason, date, category, isexpense) {
    const insertQuery = `INSERT INTO transactions (usid, amount, reason, date, category, isexpense) VALUES (@usid, @amount, @reason, @date, @category, @isexpense)`;

    const pool1 = await pool.connect();
    const request = new mssql.Request(pool1);

    var result = {};

    try {
      await request
        .input("usid", mssql.Char, this.usid)
        .input("amount", mssql.Int, amount)
        .input("reason", mssql.VarChar, reason)
        .input("date", mssql.Char, date)
        .input("category", mssql.VarChar, category)
        .input("isexpense", mssql.Bit, isexpense)
        .query(insertQuery);

      result = await new mssql.Request(pool1)
        .input("usid", mssql.Char, this.usid)
        .query(`SELECT max(rowid) FROM transactions WHERE usid = @usid`);

      // console.log(result);
    } catch (error) {
      console.log(error);
      throw new Error("Server error. Please try again later");
    }

    return { insertId: result.recordset[0][""] };
  }

  async update(amount, reason, date, category, id) {
    const updateQuery = `UPDATE transactions SET amount = @amount, reason = @reason, date = @date, category = @category WHERE rowid = @id and usid = @usid`;

    const pool1 = await pool.connect();
    const request = new mssql.Request(pool1);

    var result = {};

    try {
      result = await request
        .input("amount", mssql.Int, amount)
        .input("reason", mssql.VarChar, reason)
        .input("date", mssql.Char, date)
        .input("category", mssql.VarChar, category)
        .input("id", mssql.Int, id)
        .input("usid", mssql.Char, this.usid)
        .query(updateQuery);
    } catch (error) {
      console.log(error);
      throw new Error("Server error. Please try again later");
    }

    return result.rowsAffected[0];
  }

  async getAll() {
    const getAllQuery = `SELECT * FROM transactions WHERE usid = @usid ORDER BY date DESC`;

    // Handles case where database is inactive and hence not connected in first attempt
    // Only done for getAll() method as expiry for token is 1hr and database will get inactive only after 1hr
    let pool1;
    try {
      pool1 = await pool.connect();
    } catch (error) {
      if (error.code === "ETIMEOUT") {
        try {
          pool1 = await pool.connect();
        } catch (error) {
          throw error;
        }
      } else {
        throw error;
      }
    }
    const request = new mssql.Request(pool1);

    var result = {};

    try {
      result = await request
        .input("usid", mssql.Char, this.usid)
        .query(getAllQuery);
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
    } catch (error) {
      console.log(error);
      throw new Error("Server error. Please try again later");
    }

    return result.rowsAffected[0];
  }
}

module.exports = Transaction;
