const reviewsRouter = require("./reviews-router");
const usersRouter = require("./users-router");
const categoriesRouter = require("./categories-router");
const commentsRouter = require("./comments-router");
const { getEndpoints } = require("../controllers/endpoints-contollers");

const apiRouter = require("express").Router();

apiRouter.get("", getEndpoints);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
