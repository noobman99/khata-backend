const express = require("express");
require("dotenv").config();

const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const sqlControls = require("./controllers/sqlControls");

app.put("/transacations/:id", sqlControls.updateTransaction);
app.delete("/transacations/:id", sqlControls.deleteTransaction);
app.get("/transacations", sqlControls.getTransactions);
app.post("/transacations", sqlControls.newTransaction);

app.listen(process.env.NODE_PORT);
console.log(`Listening on port ${process.env.NODE_PORT}`);
