require("dotenv").config();
const express = require("express");
const connectToDatabase = require("./databaseConnect");

const authRoutes = require("./routes/auth");
const preferencesRoutes = require("./routes/preferences");
const newsRoutes = require("./routes/news");

const cacheUpdateScheduler = require("./taskSchedulers/cacheUpdateScedulers");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", authRoutes);
app.use("/users", preferencesRoutes);
app.use(newsRoutes);

app.use((req, res, next) => {
  res.status(404).send("Route not found");
});

// Start the cache update scheduler
cacheUpdateScheduler();

connectToDatabase(() => {
  app.listen(process.env.port, (err) => {
    if (err) {
      return console.log("Something bad happened", err);
    }
    console.log(`Server is listening on ${process.env.port}`);
  });
});

module.exports = app;
