const express = require("express");
const authController = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/requireAuth");
const { validateRequest } = require("../middleware/validateRequest");
const { loginValidator, registerValidator } = require("../utils/validators");
const { dashboardRouter } = require("./dashboard.routes");

const router = express.Router();

router.post("/register", registerValidator, validateRequest(), authController.register);
router.post("/login", loginValidator, validateRequest(), authController.login);
router.post("/logout", requireAuth, authController.logout);
router.get("/me", requireAuth, authController.me);
router.use("/me", dashboardRouter);

module.exports = { authRouter: router };
