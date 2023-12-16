const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const sqlControls = require("./controllers/sqlControls");
const authControls = require("./controllers/authControls");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/signup", authControls.signup);
app.post("/login", authControls.login);

app.put("/transactions/:id", sqlControls.updateTransaction);
app.delete("/transactions/:id", sqlControls.deleteTransaction);
app.get("/transactions", sqlControls.getTransactions);
app.post("/transactions", sqlControls.newTransaction);

mongoose.connect(process.env.MONGO_DB_URI).then(() => {
  console.log("Connected to MongoDB");
  app.listen(process.env.NODE_PORT);
});
// app.listen(process.env.NODE_PORT);
// console.log(`Listening on port ${process.env.NODE_PORT}`);
