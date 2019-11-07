const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const { handle404, handle500, handle400, handleCustoms } = require("./errors");

app.use(express.json());
app.use("/api", apiRouter);
app.use("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});
app.use(handleCustoms);
app.use(handle400);
app.use(handle500);

module.exports = app;
