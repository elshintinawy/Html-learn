const express = require("express");
const router = express.Router();
const controllers = require("../controllers/auth_controllers");
const allowedTo = require("../middlewares/allowedTo");
const verifyLogin = require("../middlewares/verifyLogin");

router.post("/register", controllers.register);

module.exports = router;
