const User = require("../models/user");

const getPreferences = (req, res) => {
  const email = req.user.email;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userPreferences = user.preferences || [];

      res.status(200).json({
        preferences: userPreferences,
      });
    })
    .catch((err) => {
      console.error("Error retrieving user preferences:", err);
      res.status(500).json({ error: "Internal server error" });
    });
};

const updatePreferences = (req, res) => {
  const { preferences } = req.body;
  const email = req.user.email;

  if (!Array.isArray(preferences)) {
    return res.status(400).json({ error: "Preferences must be an array" });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      user.preferences = preferences;
      //Whenever Preferences are updarted just reset everything;
      user.articles = [];
      user.read = [];
      user.favorites = [];
      return user.save();
    })
    .then((response) => {
      console.log("User preferences updated successfully:", response);
      res.status(200).json({
        message: "Preferences updated successfully",
        preferences: preferences,
      });
    })
    .catch((err) => {
      console.error("Error retrieving user preferences:", err);
      res.status(500).json({ error: "Internal server error" });
    });
};

module.exports = {
  getPreferences,
  updatePreferences,
};
