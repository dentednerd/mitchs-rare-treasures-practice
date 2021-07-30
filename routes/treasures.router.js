const treasuresRouter = require('express').Router();
const {
  getTreasures,
  addTreasure,
  editTreasure,
  removeTreasure,
} = require('../controllers/treasures');

treasuresRouter.get('/', getTreasures).post('/', addTreasure);
treasuresRouter
  .patch('/:treasure_id', editTreasure)
  .delete('/:treasure_id', removeTreasure);

module.exports = treasuresRouter;
