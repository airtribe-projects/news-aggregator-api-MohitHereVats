const mongoose = require("mongoose");
const { DataBaseName } = require("./utils/constants");

function connectToDatabase(callBack) {
  const uri = `${process.env.MongoDbUrl}/${DataBaseName}?retryWrites=true&w=majority&appName=NodeCluster`;
  mongoose
    .connect(uri)
    .then((res) => {
      console.log("Connected to the database successfully");
      callBack();
    })
    .catch((err) => {
      console.error("Error connecting to the database:", err);
    //   process.exit(1); // Exit the process if connection fails
    });
}

module.exports = connectToDatabase;
