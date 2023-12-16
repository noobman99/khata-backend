const express = require("express");
const authenticator = require("../middleware/authenticator");
const sqlControls = require("../controllers/sqlControls");

const router = express.Router();

router.use(authenticator);

router.put("/:id", sqlControls.updateTransaction);
router.delete("/:id", sqlControls.deleteTransaction);
router.get("/", sqlControls.getTransactions);
router.post("/", sqlControls.newTransaction);

module.exports = router;
