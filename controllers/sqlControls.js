const Transaction = require("../models/Transaction");

exports.getTransactions = async (req, res, next) => {
  var transaction;

  try {
    transaction = new Transaction(req.tId);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(500).json({
      success: false,
      error: "Server error. Please try again later",
    });
  }

  transaction
    .getAll()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        error: err.message,
      });
    });
};

exports.newTransaction = async (req, res, next) => {
  var transaction;

  try {
    transaction = new Transaction(req.tId);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(500).json({
      success: false,
      error: "Server error. Please try again later",
    });
  }

  transaction
    .insert(req.body.amount, req.body.reason, req.body.date, req.body.category)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        error: err.message,
      });
    });
};

exports.updateTransaction = async (req, res, next) => {
  var transaction;

  try {
    transaction = new Transaction(req.tId);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(500).json({
      success: false,
      error: "Server error. Please try again later",
    });
  }

  transaction
    .update(
      req.body.amount,
      req.body.reason,
      req.body.date,
      req.body.category,
      req.params.id
    )
    .then((data) => {
      if (data == 0) {
        res.status(404).json({
          success: false,
          error: "Could not update transaction. Please try again later.",
        });
      } else {
        res.status(200).json(data);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        error: "Could not update transaction. Please try again later.",
      });
    });
};

exports.deleteTransaction = async (req, res, next) => {
  var transaction;

  try {
    transaction = new Transaction(req.tId);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(500).json({
      success: false,
      error: "Server error. Please try again later",
    });
  }

  transaction
    .delete(req.params.id)
    .then((data) => {
      if (data == 0) {
        res.status(404).json({
          success: false,
          error: "Transaction not found.",
        });
      } else {
        res.status(200).json(data);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        error: "Could not delete transaction. Please try again later.",
      });
    });
};
