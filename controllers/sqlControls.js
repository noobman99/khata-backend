const db = require("../connections/db");
const Transaction = require("../models/transaction");

exports.getTransactions = async (req, res, next) => {
  db.query(Transaction.get_all_query)
    .then(([rows, fields]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.newTransaction = async (req, res, next) => {
  const transaction = new Transaction(
    req.body.amount,
    req.body.reason,
    req.body.date
  );
  db.query(transaction.insert_query, transaction.insert_params())
    .then(([rows, fields]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updateTransaction = async (req, res, next) => {
  const transaction = new Transaction(
    req.params.id,
    req.body.amount,
    req.body.reason,
    req.body.date
  );
  db.query(transaction.update_query, transaction.update_params())
    .then(([rows, fields]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteTransaction = async (req, res, next) => {
  db.query(Transaction.delete_query, [req.params.id])
    .then(([rows, fields]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      console.log(err);
    });
};
