exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    console.log("PSQL", err);
    res.status(400).send({ msg: "Invalid Request" });
  } else if (err.code === "23502") {
    console.log("PSQL", err);
    res.status(400).send({ msg: "Invalid Request" });
  } else next(err);
};

exports.handle400Errors = (err, req, res, next) => {
  if (err === "Invalid Request") {
    console.log("400", err);
    res.status(400).send({ msg: "Invalid Request" });
  } else next(err);
};

exports.handle404Errors = (err, req, res, next) => {
  if (err === "Not Found") {
    console.log("404", err);
    res.status(404).send({ msg: "Not Found" });
  } else next(err);
};

exports.handle500Error = (err, req, res, next) => {
  console.log("500", err);
  res.status(500).send({ message: "server error" });
};
