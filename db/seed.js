const db = require('./');
const format = require('pg-format');
const treasures = require('./data/dev-data/treasures');
const createRefTable = require('../utils/createRefTable');
const formatData = require('../utils/formatData');

const seed = ({ shopData, treasureData }) => {
  return db
    .query(`DROP TABLE IF EXISTS treasures;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS shops;`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE shops (
        shop_id SERIAL PRIMARY KEY,
        shop_name VARCHAR(255) NOT NULL,
        slogan TEXT
      );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE treasures (
          treasure_id SERIAL PRIMARY KEY,
          treasure_name VARCHAR(255) NOT NULL,
          colour VARCHAR(255) NOT NULL,
          age INT NOT NULL,
          cost_at_auction FLOAT NOT NULL,
          shop_id INT REFERENCES shops(shop_id)
        );
      `);
    })
    .then(() => {
      const queryStr = format(
        `INSERT INTO shops
          (shop_name, slogan)
          VALUES
          %L
          RETURNING *;`,
        shopData.map((shop) => [shop.shop_name, shop.slogan]),
      );
      return db.query(queryStr);
    })
    .then(() => {
      return db.query(`SELECT * FROM shops;`);
    })
    .then((data) => {
      const shops = data.rows;
      const shopsRefTable = createRefTable(shops, 'shop_name', 'shop_id');

      const newTreasureData = formatData(
        treasureData,
        shopsRefTable,
        'shop',
        'shop_id',
      );

      const queryStr = format(
        `INSERT INTO treasures
          (treasure_name, colour, age, cost_at_auction, shop_id)
          VALUES
          %L
          RETURNING *;`,
        newTreasureData.map((treasure) => [
          treasure.treasure_name,
          treasure.colour,
          treasure.age,
          treasure.cost_at_auction,
          treasure.shop_id,
        ]),
      );
      return db.query(queryStr);
    });
};

module.exports = seed;
