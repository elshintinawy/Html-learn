const express = require("express");
const verifyLogin = require("../middlewares/verifyLogin");
const allowedTo = require("../middlewares/allowedTo");
const controllers = require("../controllers/employee_controllers");
const userRoles = require("../utils/user_roles");
const router = express.Router();
/* const allowedTo = require("../middlewares/allowedTo");
const verifyLogin = require("../middlewares/verifyLogin"); */

router.get(
  "/",
  verifyLogin,
  allowedTo(userRoles.ADMIN),
  controllers.GetAllEmployees
);
router.get(
  "/:nationalId",
  verifyLogin,
  allowedTo(userRoles.ADMIN),
  controllers.GetEmployeeById
);
router.delete(
  "/deleteEmployee/:nationalId",
  verifyLogin,
  allowedTo(userRoles.ADMIN),
  controllers.DeleteEmployee
);
router.patch(
  "/UpdateEmployee/:nationalId",
  verifyLogin,
  allowedTo(userRoles.ADMIN),
  controllers.UpdateEmployee
);

module.exports = router;
