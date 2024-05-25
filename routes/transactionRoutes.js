const express = require("express");
const authenticator = require("../middleware/authenticator");
const transactionControls = require("../controllers/transactionControls");

const router = express.Router();

router.use(authenticator);

router.put("/:id", transactionControls.updateTransaction);
router.delete("/:id", transactionControls.deleteTransaction);
router.get("/", transactionControls.getTransactions);
router.post("/", transactionControls.newTransaction);

module.exports = router;
