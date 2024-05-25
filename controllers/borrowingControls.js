const { formatBorrowing, formatLending } = require("../helpers/dataFormatter");
const Borrowing = require("../models/Borrowing");
const User = require("../models/User");

exports.getLendings = async (req, res, next) => {
  console.log("getLendings");
  var borrowing;

  try {
    borrowing = new Borrowing(req.tId);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(500).json({
      success: false,
      error: "Server error. Please try again later",
    });
  }

  borrowing
    .getAllLent()
    .then(async (data) => {
      let resJson = [];
      for (let chunk of data) {
        resJson.push(await formatLending(chunk));
      }
      res.status(200).json(resJson);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        error: "Could not get lendings. Please try later.",
      });
    });
};

exports.getBorrowings = async (req, res, next) => {
  console.log("getBorrowings");
  var borrowing;

  try {
    borrowing = new Borrowing(req.tId);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(500).json({
      success: false,
      error: "Server error. Please try again later",
    });
  }

  borrowing
    .getAllBorrowed()
    .then(async (data) => {
      let resJson = [];
      for (let chunk of data) {
        resJson.push(await formatBorrowing(chunk));
      }
      res.status(200).json(resJson);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        error: "Could not get borrowings. Please try later.",
      });
    });
};

exports.newBorrowing = async (req, res, next) => {
  console.log("newBorrowing");
  const { amount, reason, date, person } = req.body;

  let borrower = await User.findOne({ uId: person }, "tId");

  if (!borrower) {
    res.status(404).json({
      success: false,
      error: "Person not found.",
    });

    return;
  }

  const borrowing = new Borrowing(req.tId, amount, reason, date, borrower.tId);

  borrowing
    .add()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        error: "Could not add borrowing. Please try later.",
      });
    });
};

exports.updateBorrowing = async (req, res, next) => {
  console.log("updateBorrowing");
  const { amount, reason, date, person } = req.body;
  const borrowing = new Borrowing(req.tId, amount, reason, date, person);

  borrowing
    .update(req.params.id)
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
        error: "Could not update borrowing. Please try later.",
      });
    });
};

exports.deleteBorrowing = async (req, res, next) => {
  console.log("deleteBorrowing");
  const borrowing = new Borrowing(req.tId);

  borrowing
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
        error: "Could not delete borrowing. Please try later.",
      });
    });
};
