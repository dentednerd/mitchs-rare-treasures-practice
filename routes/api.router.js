const treasuresRouter = require('./treasures.router');

const apiRouter = require('express').Router();

apiRouter.use('/treasures', treasuresRouter);

module.exports = apiRouter;
