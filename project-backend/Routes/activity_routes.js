const express = require("express");
const router = express.Router();
const controllers = require("../controllers/activity_controllers");
/* const allowedTo = require("../middlewares/allowedTo");
const verifyLogin = require("../middlewares/verifyLogin"); */


router.post("/", controllers.AddNewActivity);
router.get("/", controllers.GetAllActivites);
router.get("/:activityCode", controllers.GetActivityById);
router.delete("/deleteActivity/:activityCode", controllers.DeleteActivity);
router.patch("/UpdateActivity/:activityCode", controllers.UpdateActivity);

module.exports = router;
