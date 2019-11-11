const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const {
  handle404,
  handle500,
  handle400,
  handleCustoms,
  handle405
} = require("./errors");

app.use(express.json());
app.use("/api", apiRouter);
app.use(handleCustoms);
// app.use(handle404);
app.use(handle400);
app.use(handle500);

module.exports = app;
