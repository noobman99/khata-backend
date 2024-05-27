const mssql = require("mssql");
const pool = require("../connections/db");

class Borrowing {
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

  async insert(amount, reason, date, borrower) {
    const insertQuery = `INSERT INTO borrowings (usid, amount, reason, date, borrower) VALUES (@usid, @amount, @reason, @date, @borrower)`;

    const pool1 = await pool.connect();
    const request = new mssql.Request(pool1);

    var result = {};

    try {
      await request
        .input("usid", mssql.Char, this.usid)
        .input("amount", mssql.Int, amount)
        .input("reason", mssql.VarChar, reason)
        .input("date", mssql.Char, date)
        .input("borrower", mssql.VarChar, borrower)
        .query(insertQuery);

      result = await new mssql.Request(pool1)
        .input("usid", mssql.Char, this.usid)
        .query(`SELECT max(rowid) FROM borrowings WHERE usid = @usid`);

      // console.log(result);
    } catch (error) {
      console.log(error);
      throw new Error("Server error. Please try again later");
    }

    return { insertId: result.recordset[0][""] };
  }

  async update(amount, reason, date, id) {
    const updateQuery = `UPDATE borrowings SET amount = @amount, reason = @reason, date = @date WHERE rowid = @id and usid = @usid`;

    const pool1 = await pool.connect();
    const request = new mssql.Request(pool1);

    var result = {};

    try {
      result = await request
        .input("amount", mssql.Int, amount)
        .input("reason", mssql.VarChar, reason)
        .input("date", mssql.Char, date)
        .input("id", mssql.Int, id)
        .input("usid", mssql.Char, this.usid)
        .query(updateQuery);
    } catch (error) {
      console.log(error);
      throw new Error("Server error. Please try again later");
    }

    return result.rowsAffected[0];
  }

  async delete(id) {
    const deleteQuery = `DELETE FROM borrowings WHERE rowid = @id and usid = @usid`;

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

  async getAllLent() {
    const selectQuery = `SELECT * FROM borrowings WHERE usid = @usid`;

    const pool1 = await pool.connect();
    const request = new mssql.Request(pool1);

    var result = {};

    try {
      result = await request
        .input("usid", mssql.Char, this.usid)
        .query(selectQuery);
    } catch (error) {
      console.log(error);
      throw new Error("Server error. Please try again later");
    }

    return result.recordset;
  }

  async getAllBorrowed() {
    const selectQuery = `SELECT * FROM borrowings WHERE borrower = @usid`;

    const pool1 = await pool.connect();
    const request = new mssql.Request(pool1);

    var result = {};

    try {
      result = await request
        .input("usid", mssql.Char, this.usid)
        .query(selectQuery);
    } catch (error) {
      console.log(error);
      throw new Error("Server error. Please try again later");
    }

    return result.recordset;
  }
}

module.exports = Borrowing;
