const express = require("express");
require("dotenv").config();

const app = express();
const cors = require("cors");

app.use(cors());

const sqlControls = require("./controllers/sqlControls");

app.get("/", sqlControls.getTransactions);
app.post("/", sqlControls.newTransaction);
app.put("/:id", sqlControls.updateTransaction);
app.delete("/:id", sqlControls.deleteTransaction);

app.listen(process.env.NODE_PORT);
console.log(`Listening on port ${process.env.NODE_PORT}`);
