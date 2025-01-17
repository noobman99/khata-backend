const { formatTransaction } = require("../helpers/dataFormatter");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

exports.getTransactions = async (req, res, next) => {
  console.log("getTransactions");
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
      res
        .status(200)
        .json(data.map((transaction) => formatTransaction(transaction)));
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        error: "Could not get transactions. Please try later.",
      });
    });
};

exports.newTransaction = async (req, res, next) => {
  console.log("newTransaction");
  var transaction;
  const basecategs = ["Food", "Travel", "Shopping"];

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
    .insert(
      req.body.amount,
      req.body.reason,
      req.body.date,
      req.body.category,
      req.body.isexpense
    )
    .then(async (data) => {
      let user = await User.findOne({ tId: req.tId });
      let categories;

      if (req.body.isexpense) {
        categories = basecategs.concat(user.expCategories);
      } else {
        categories = user.incCategories;
      }

      if (!categories.includes(req.body.category)) {
        categories.push(req.body.category);
        if (req.body.isexpense) {
          user.expCategories = categories;
        } else {
          user.incCategories = categories;
        }
        user.save();
      }

      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        error: "Could not insert transaction. Please try again later.",
      });
    });
};

exports.updateTransaction = async (req, res, next) => {
  console.log("updateTransaction");

  var transaction;
  const basecategs = ["Food", "Travel", "Shopping"];

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
    .then(async (data) => {
      if (data == 0) {
        res.status(404).json({
          success: false,
          error: "Could not update transaction. Please try again later.",
        });
      } else {
        let user = await User.findOne({ tId: req.tId });
        let categories;

        if (req.body.isexpense) {
          categories = basecategs.concat(user.expCategories);
        } else {
          categories = user.incCategories;
        }

        if (!categories.includes(req.body.category)) {
          categories.push(req.body.category);
          if (req.body.isexpense) {
            user.expCategories = categories;
          } else {
            user.incCategories = categories;
          }
          user.save();
        }

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
  console.log("deleteTransaction");

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
