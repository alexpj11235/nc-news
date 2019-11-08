exports.handleCustoms = (err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
};

exports.handle400 = (err, req, res, next) => {
  res.status(400).send({ msg: "bad request" });
};

exports.handle404 = (err, req, res, next) => {
  res.status(404).send({ msg: "path not found" });
};
exports.handle500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "server error" });
};

exports.handle405 = (req, res, next) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};
