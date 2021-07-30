const {
  fetchTreasures,
  insertTreasure,
  updateTreasure,
  deleteTreasure,
} = require('../models/treasures');

const getTreasures = (req, res) => {
  const { sort_by, order, colour } = req.query;
  fetchTreasures(sort_by, order, colour)
    .then((treasures) => {
      res.status(200).send({ treasures });
    })
    .catch((err) => {
      res.status(err.status).send({ msg: err.msg });
    });
};

const addTreasure = (req, res) => {
  const newTreasure = req.body;
  insertTreasure(newTreasure)
    .then((treasure) => {
      res.status(201).send({ treasure });
    })
    .catch((err) => {
      res.status(err.status).send({ msg: err.msg });
    });
};

const editTreasure = (req, res) => {
  const { treasure_id } = req.params;
  const { cost_at_auction } = req.body;
  updateTreasure(treasure_id, cost_at_auction).then((treasure) => {
    res.status(200).send({ treasure });
  });
};

const removeTreasure = (req, res) => {
  const { treasure_id } = req.params;
  deleteTreasure(treasure_id).then((deletedTreasure) => {
    res.status(200).send({ treasure: deletedTreasure });
  });
};

module.exports = { getTreasures, addTreasure, editTreasure, removeTreasure };
