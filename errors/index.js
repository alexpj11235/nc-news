exports.handleCustoms = (err, req, res, next) => {
  // console.log(err.code);
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
  if (err.code === "23503") {
    res.status(404).send({
      msg: `No article found for this article_id`
    });
  } else {
    next(err);
  }
};

exports.handle400 = (err, req, res, next) => {
  const psql400Codes = ["22P02", "42703"];

  if (psql400Codes.includes(err.code)) {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

exports.handle404 = (err, req, res, next) => {
  res.status(404).send({ msg: "path not found" });
};
exports.handle500 = (err, req, res, next) => {
  // console.log(err);
  res.status(500).send({ msg: "server error" });
};

exports.handle405 = (req, res, next) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};
