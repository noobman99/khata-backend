const User = require("../models/User");

exports.formatTransaction = (transaction) => {
  return {
    id: transaction.rowid,
    amount: transaction.amount,
    date: transaction.date,
    category: transaction.category,
    reason: transaction.reason,
    isexpense: transaction.isexpense,
  };
};

exports.formatLending = async (borrowing) => {
  let borrower = await User.findOne({ tId: borrowing.person }, "uId");

  return {
    id: borrowing.rowid,
    amount: borrowing.amount,
    reason: borrowing.reason,
    date: borrowing.date,
    person: borrower.uId,
  };
};

exports.formatBorrowing = async (borrowing) => {
  let lender = await User.findOne({ tId: borrowing.usid }, "uId");

  return {
    id: borrowing.rowid,
    amount: borrowing.amount,
    reason: borrowing.reason,
    date: borrowing.date,
    person: lender.uId,
  };
};
