const express = require("express");
const { getCategories } = require("./controllers/categories");
const { getReviews } = require("./controllers/reviews");
const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Invalid Path" });
});

module.exports = app;
