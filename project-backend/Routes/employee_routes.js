const express = require("express");
const router = express.Router();
const controllers = require("../controllers/employee_controllers");
/* const allowedTo = require("../middlewares/allowedTo");
const verifyLogin = require("../middlewares/verifyLogin"); */

router.get("/", controllers.GetAllEmployees);
router.get("/:nationalId", controllers.GetEmployeeById);
router.delete("/deleteEmployee/:nationalId", controllers.DeleteEmployee);
router.patch("/UpdateEmployee/:nationalId", controllers.UpdateEmployee);


module.exports = router;
