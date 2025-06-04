const exppress = require("express");

const isAuthenticated = require("../middleware/isAuthenticated");

const preferencesControllers = require("../controllers/preferencesControllers");

const router = exppress.Router();

router.use(isAuthenticated);

router.get("/preferences", preferencesControllers.getPreferences);

router.put("/preferences", preferencesControllers.updatePreferences);

module.exports = router;
