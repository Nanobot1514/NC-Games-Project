exports.handle500Error = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "server error" });
};
