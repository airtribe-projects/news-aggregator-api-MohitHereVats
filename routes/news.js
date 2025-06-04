const exppress = require("express");

const isAuthenticated = require("../middleware/isAuthenticated");
const newsControllers = require("../controllers/newsControllers");

const router = exppress.Router();

router.use(isAuthenticated);

router.get("/news", newsControllers.getNews);

router.get("/news/read", newsControllers.getAllReadNews);

router.post("/news/:id/read", newsControllers.markNewsAsRead);

router.get("/news/favorites", newsControllers.getAllFavoriteNews);

router.post("/news/:id/favorite", newsControllers.markNewsAsFavorite);

router.get("/news/search/:keyword", newsControllers.searchNewsWithKeyword);

module.exports = router;
