const express = require("express");

const {
  handle500Error,
  handlePSQLErrors,
  handle400Errors,
  handle404Errors,
} = require("./controllers/error-handling-controllers");

const apiRouter = require("./routes/api-router");
const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use(handle400Errors);
app.use(handlePSQLErrors);
app.use(handle404Errors);
app.use(handle500Error);

module.exports = app;
