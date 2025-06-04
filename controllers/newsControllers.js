const axios = require("axios");
const NodeCache = require("node-cache");

const User = require("../models/user");

const newsCache = new NodeCache({ stdTTL: 3600 });

const fetchNewsFromAPI = async (updateCache = false) => {
  try {
    // Check if the news data is cached
    const cachedNews = newsCache.get("newsSources");
    if (cachedNews && !updateCache) {
      // If cached data is available and not updating, return cached data
      console.log("Returning cached news sources");
      return cachedNews;
    }
    const apiKey = process.env.newsApiKey;
    const apiUrl = "https://newsapi.org/v2/top-headlines/sources";
    const params = {
      // country: "us",
      //language: "en",
      // category: "business",
      // pageSize: 100,
    };
    const response = await axios.get(apiUrl, {
      headers: {
        "X-Api-Key": apiKey,
      },
      params: params,
    });
    console.log("Printing the response Here : ");
    console.log(response.data);
    if (response.data.status != "ok") {
      throw {
        message: response.data.message,
        code: response.data.code,
      };
    }
    // Cache the news data
    newsCache.set("newsSources", response.data.sources);
    return response.data.sources;
  } catch (error) {
    console.error("Error fetching news with params from API:", error.message);
    throw error;
  }
};

const fetchNewsWithKeyword = async (keyword) => {
  try {
    const apiKey = process.env.newsApiKey;
    const apiUrl = "https://newsapi.org/v2/everything";
    const params = {
      q: keyword,
      sortBy: "popularity",
    };
    const response = await axios.get(apiUrl, {
      headers: {
        "X-Api-Key": apiKey,
      },
      params: params,
    });
    if (response.data.status != "ok") {
      throw {
        message: response.data.message,
        code: response.data.code,
      };
    }
    return response.data.articles;
  } catch (error) {
    console.error("Error fetching news with keyword:", error.message);
    throw error;
  }
};

//Peridically update the news cache every hour
const setPeriodicUpdatesToCache = () => {
  const updateInterval = 3600000; // 1 hour in milliseconds
  setInterval(async () => {
    try {
      console.log("Updating news cache...");
      await fetchNewsFromAPI(true);
      console.log("News cache updated successfully.");
    } catch (error) {
      console.error("Error updating news cache:", error.message);
    }
  }, updateInterval);
};

const getNews = async (req, res) => {
  try {
    const newsSources = await fetchNewsFromAPI();
    const user = await User.findOne({ email: req.user.email });
    const articles = [];
    newsSources.forEach((news) => {
      user.preferences.forEach((preferences) => {
        if (news.category == preferences) {
          articles.push(news);
        }
      });
    });
    user.articles = articles;
    await user.save();
    res.status(200).json({ news: articles });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
};
const getAllReadNews = (req, res, next) => {
  const email = req.user.email;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const readArticles = [];
      user.articles.forEach((article) => {
        user.read.forEach((readId) => {
          if (readId == article.id) {
            readArticles.push(article);
          }
        });
      });
      res.status(200).json({ read: readArticles });
    })
    .catch((err) => {
      console.error("Error retrieving read articles:", err);
      res.status(500).json({ error: "Internal server error" });
    });
};

const markNewsAsRead = (req, res, next) => {
  const readId = req.params.id;
  const email = req.user.email;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const article = user.articles.find((article) => article.id == readId);
      if (!article) {
        return res
          .status(404)
          .json({ error: "This Article was not found in your preferences" });
      }

      const doesReadArticleExists = user.read.find((id) => id == readId);
      if (doesReadArticleExists) {
        return res
          .status(409)
          .json({ error: "You have already marked it as read" });
      }

      user.read.push(readId);
      return user
        .save()
        .then(() => {
          res.status(200).json({
            message: "News Artcle Marked as read",
            article: article,
          });
        })
        .catch((err) => {
          console.log("Error while saving to database ", err);
        });
    })
    .catch((err) => {
      res.status(500).json({ error: "Internal server error" });
    });
};

const getAllFavoriteNews = (req, res, next) => {
  const email = req.user.email;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const favoritesArtcles = [];
      user.articles.forEach((article) => {
        user.favorites.forEach((favId) => {
          if (favId == article.id) {
            favoritesArtcles.push(article);
          }
        });
      });
      res.status(200).json({ favorites: favoritesArtcles });
    })
    .catch((err) => {
      console.error("Error retrieving favorites articles:", err);
      res.status(500).json({ error: "Internal server error" });
    });
};

const markNewsAsFavorite = (req, res, next) => {
  const favId = req.params.id;
  const email = req.user.email;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const article = user.articles.find((article) => article.id == favId);
      if (!article) {
        return res
          .status(404)
          .json({ error: "This Article was not found in your preferences" });
      }

      const doesFavArticleExists = user.favorites.find((id) => id == favId);
      if (doesFavArticleExists) {
        return res
          .status(409)
          .json({ error: "You have already marked it as favorites" });
      }

      user.favorites.push(favId);
      return user
        .save()
        .then(() => {
          res.status(200).json({
            message: "News Artcle Marked as favorites",
            article: article,
          });
        })
        .catch((err) => {
          console.log("Error while saving to database ", err);
        });
    })
    .catch((err) => {
      res.status(500).json({ error: "Internal server error" });
    });
};

const searchNewsWithKeyword = async (req, res) => {
  const keyword = req.params.keyword;
  if (!keyword) {
    return res.status(400).json({ error: "Keyword is required" });
  }
  try {
    const articles = await fetchNewsWithKeyword(keyword);
    res.status(200).json({ articles });
  } catch (error) {
    console.error("Error fetching news with keyword:", error);
    res.status(500).json({ error: "Failed to fetch news with keyword" });
  }
};

module.exports = {
  setPeriodicUpdatesToCache,
  getNews,
  getAllReadNews,
  markNewsAsRead,
  getAllFavoriteNews,
  markNewsAsFavorite,
  searchNewsWithKeyword,
};
