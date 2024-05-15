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
