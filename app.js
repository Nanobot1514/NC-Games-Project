const express = require("express");
const cors = require("cors");

const {
  handle500Error,
  handlePSQLErrors,
  handle400Errors,
  handle404Errors,
} = require("./controllers/error-handling-controllers");

const apiRouter = require("./routes/api-router");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.use(handle400Errors);
app.use(handlePSQLErrors);
app.use(handle404Errors);
app.use(handle500Error);

module.exports = app;
