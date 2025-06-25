const express = require("express");
const router = express.Router();
const controllers = require("../controllers/activity_controllers");
const verifyLogin = require("../middlewares/verifyLogin");
const allowedTo = require("../middlewares/allowedTo");
const userRoles = require("../utils/user_roles");


router.post("/", controllers.AddNewActivity);
router.get("/", controllers.GetAllActivites);
router.get("/:activityCode", controllers.GetActivityById);
router.delete("/:activityCode", controllers.DeleteActivity);
router.put("/:activityCode",
  verifyLogin,
  allowedTo(userRoles.ADMIN, userRoles.MANAGER, userRoles.FINANCIAL),
  controllers.UpdateActivity
);
module.exports = router;
