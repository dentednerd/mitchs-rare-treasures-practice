const db = require('../db');

exports.fetchTreasures = (sortBy = 'age', sortOrder = 'asc', colour) => {
  if (!['age', 'cost_at_auction', 'treasure_name'].includes(sortBy)) {
    return Promise.reject({ status: 400, msg: 'Invalid sort by value' });
  }

  if (!['asc', 'ASC', 'DESC', 'desc'].includes(sortOrder)) {
    return Promise.reject({ status: 400, msg: 'Invalid sort order value' });
  }

  const baseQuery = `SELECT age, colour, cost_at_auction, treasure_id, treasure_name, shop_name FROM treasures
    JOIN shops ON treasures.shop_id = shops.shop_id`;

  const sortClause = `ORDER BY ${sortBy} ${sortOrder}`;

  const fullQuery = `${baseQuery} ${sortClause};`;

  return db.query(fullQuery).then((data) => {
    if (colour) {
      return data.rows.filter((row) => {
        return row.colour === colour;
      });
    }
    return data.rows;
  });
};

exports.insertTreasure = (newTreasure) => {
  const { age, colour, cost_at_auction, treasure_name, shop_id } = newTreasure;
  return db
    .query(
      `
  INSERT INTO treasures (age, colour, cost_at_auction, treasure_name, shop_id)
  VALUES
  ($1, $2, $3, $4, $5)
  RETURNING *;
  `,
      [age, colour, cost_at_auction, treasure_name, shop_id],
    )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      return Promise.reject({
        status: 400,
        msg: 'Treasure not added, invalid data',
      });
    });
};

exports.updateTreasure = (treasureId, costAtAuction) => {
  return db
    .query(
      `
    UPDATE treasures 
      SET 
      cost_at_auction = $1
      WHERE treasure_id = $2
      RETURNING *;
  `,
      [costAtAuction, treasureId],
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.deleteTreasure = (treasureId) => {
  return db
    .query(
      `
    DELETE FROM treasures WHERE treasure_id = $1 RETURNING *;
  `,
      [treasureId],
    )
    .then((result) => {
      return result.rows[0];
    });
};
