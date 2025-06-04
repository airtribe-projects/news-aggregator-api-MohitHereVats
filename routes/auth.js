const express = require("express");

const authControllers = require("../controllers/authControllers");
const {
  validRegistrationRequest,
  validLoginRequest,
} = require("../middleware/validationChecks");

const router = express.Router();

router.post("/login", [validLoginRequest], authControllers.loginContoller);

router.post(
  "/signup",
  [validRegistrationRequest],
  authControllers.signUpController
);

module.exports = router;
