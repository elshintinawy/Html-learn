const express = require("express");
const router = express.Router();
const controllers = require("../controllers/auth_controllers");
const verifyLogin = require("../middlewares/verifyLogin");

router.post("/register", controllers.register);
router.post("/login", controllers.login);
router.get("/me", verifyLogin, controllers.getProfile);
router.put("/changePassword", verifyLogin, controllers.changePassword);

module.exports = router;
