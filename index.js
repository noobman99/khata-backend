const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const transactionRoutes = require("./routes/transactionRoutes");
const profileRoutes = require("./routes/profileRoutes");
const authControls = require("./controllers/authControls");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/signup", authControls.signup);
app.post("/login", authControls.login);
app.post("/forgotpassword", authControls.forgotPassword);
app.post("/resetpassword", authControls.resetPassword);
app.post("/cancelreset", authControls.cancelReset);
app.get("/", (req, res) => {
  res.send("Hello from the server");
});

app.use("/transactions", transactionRoutes);
app.use("/profile", profileRoutes);

console.log("Connecting to MongoDB...");
// console.log(process.env.PORT);

mongoose.connect(process.env.MONGO_DB_URI).then(() => {
  console.log("Connected to MongoDB, listening on PORT", process.env.PORT);
  app.listen(process.env.PORT);
});
// app.listen(process.env.NODE_PORT);
// console.log(`Listening on port ${process.env.NODE_PORT}`);
