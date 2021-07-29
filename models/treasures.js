const db = require('../db');

exports.fetchTreasures = (sortBy = 'age', sortOrder = 'asc') => {
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
    return data.rows;
  });
};
