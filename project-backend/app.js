require("dotenv").config();
const authRoutes = require("./Routes/auth_routes");
const employeeRoutes = require("./Routes/employee_routes");
const activityRoutes = require("./Routes/activity_routes");
const connectDB = require("./utils/connect_db");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
connectDB();
app.use("/auth", authRoutes);
app.use("/employee", employeeRoutes);
app.use("/activity", activityRoutes);

/* app.all("*", (req, res, next) => {
  return res
    .status(404)
    .json({message :"Route not found"});
}) */

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
