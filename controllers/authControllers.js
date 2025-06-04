const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const signUpController = (req, res, next) => {
  const { name, password, email, preferences } = req.body;
  const user = {
    name,
    password,
    email,
    preferences,
  };
  const saltRounds = Number(process.env.saltRounds);
  const hashedPassword = bcrypt.hashSync(user.password, saltRounds);
  if (!hashedPassword) {
    console.log("Error hashing password");
    return res.status(500).send("Error hashing password");
  }
  user.password = hashedPassword;
  User.create(user)
    .then(() => {
      res.status(200).send("User created successfully");
    })
    .catch((err) => {
      console.error("Error creating user:", err);
      res.status(500).send("Internal Server Error");
    });
};

const loginContoller = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(401).send("This email is not registered");
      }
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send("Password is incorrect");
      }
      const token = user.generateAuthToken();
      res.status(200).send({
        token,
      });
    })
    .catch((err) => {
      console.error("Error during login:", err);
      res.status(500).send("Internal Server Error");
    });
};

module.exports = { signUpController, loginContoller };
