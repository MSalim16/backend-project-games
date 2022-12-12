const express = require("express");
const { getCategories } = require("./controllers/categories");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Invalid Path" });
});

module.exports = app;