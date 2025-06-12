require("dotenv").config();
const authRoutes =  require("./Routes/auth_routes")
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

/* app.all("*", (req, res, next) => {
  return res
    .status(404)
    .json({message :"Route not found"});
}) */



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
