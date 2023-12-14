const db = require("../connections/db");
const Transaction = require("../models/transaction");

exports.getTransactions = async (req, res, next) => {
  db.query(Transaction.get_all_query)
    .then(([rows, fields]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.send("Server error. Please try again later");
    });
};

exports.newTransaction = async (req, res, next) => {
  const transaction = new Transaction(
    req.body.amount,
    req.body.reason,
    req.body.date,
    req.body.category
  );
  console.log("new transaction", transaction);
  db.query(Transaction.insert_query, transaction.insert_params())
    .then(([rows, fields]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.send("Server Error. Please try again later");
    });
};

exports.updateTransaction = async (req, res, next) => {
  const transaction = new Transaction(
    req.body.amount,
    req.body.reason,
    req.body.date,
    req.body.category,
    req.params.id
  );
  db.query(Transaction.update_query, transaction.update_params())
    .then(([rows, fields]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.send("Server Error. Please try again later");
    });
};

exports.deleteTransaction = async (req, res, next) => {
  db.query(Transaction.delete_query, [req.params.id])
    .then(([rows, fields]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.send("Server Error. Please try again later");
    });
};
