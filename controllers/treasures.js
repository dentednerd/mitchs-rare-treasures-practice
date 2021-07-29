const { fetchTreasures } = require('../models/treasures');

const getTreasures = (req, res) => {
  const { sort_by, order } = req.query;
  fetchTreasures(sort_by, order).then((treasures) => {
    res.status(200).send({ treasures });
  });
};

module.exports = getTreasures;
