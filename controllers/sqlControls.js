const db = require("../connections/db");
const Transaction = require("../models/Transaction");

exports.getTransactions = async (req, res, next) => {
  let transaction;
  try {
    transaction = new Transaction(req.tId);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(500).json({
      success: false,
      error: "Server error. Please try again later",
    });
  }

  db.query(transaction.getAllQuery)
    .then(([rows, fields]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        error: "Server error. Please try again later",
      });
    });
};

exports.newTransaction = async (req, res, next) => {
  let transaction;
  try {
    transaction = new Transaction(req.tId);
    transaction.setDetails(
      req.body.amount,
      req.body.reason,
      req.body.date,
      req.body.category
    );
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(500).json({
      success: false,
      error: "Server error. Please try again later",
    });
  }

  console.log("new transaction", transaction);
  db.query(transaction.insertQuery, transaction.insert_params())
    .then(([rows, fields]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        error: "Server error. Please try again later",
      });
    });
};

exports.updateTransaction = async (req, res, next) => {
  let transaction;
  try {
    transaction = new Transaction(req.tId);
    transaction.setDetails(
      req.body.amount,
      req.body.reason,
      req.body.date,
      req.body.category,
      req.params.id
    );
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(500).json({
      success: false,
      error: "Server error. Please try again later",
    });
  }

  db.query(transaction.updateQuery, transaction.updateParams())
    .then(([rows, fields]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        error: "Server error. Please try again later",
      });
    });
};

exports.deleteTransaction = async (req, res, next) => {
  let transaction;
  try {
    transaction = new Transaction(req.tId);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(500).json({
      success: false,
      error: "Server error. Please try again later",
    });
  }

  db.query(transaction.deleteQuery, [req.params.id])
    .then(([rows, fields]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        error: "Server error. Please try again later",
      });
    });
};
