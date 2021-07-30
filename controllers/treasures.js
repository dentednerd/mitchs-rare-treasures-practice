const {
  fetchTreasures,
  insertTreasure,
  updateTreasure,
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

module.exports = { getTreasures, addTreasure, editTreasure };
