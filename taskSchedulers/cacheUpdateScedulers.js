const { setPeriodicUpdatesToCache } = require("../controllers/newsControllers");

const cacheUpdateScheduler = () => {
  // Schedule periodic updates to the cache
  setPeriodicUpdatesToCache();
};

module.exports = cacheUpdateScheduler;
