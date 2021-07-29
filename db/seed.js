const db = require('./');
const format = require('pg-format');
const treasures = require('./data/dev-data/treasures');

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
      `)
    })
    .then(() => {
      console.log(shopData);

      const queryStr = format(
        `INSERT INTO shops
          (shop_name, slogan)
          VALUES
          %L
          RETURNING *;`,
        shopData.map((shop) => [
          shop.shop_name,
          shop.slogan
        ])
      );
      return db.query(queryStr);
    }).then(() => {
      return db.query(`SELECT * FROM shops;`)
    }).then((data) => {
      // console.log(data);
      const shops = data.rows;
      // using this ^^, we have to create our own "reference table", but in JS not in SQL -- call it shopsRefTable
      // will look like:
      // {
      //   shop_nameA: shop_idA,
      //   shop_nameB: shop_idB,
      //   shop_nameC: shop_idC,
      // }
      // (this could be our first util function, call it createRefTable?)
      // THEN replace treasureData.shop with the matching reference from shopsRefTable (this will also be a util function, mapping over treasureData, call it something like formatData?)
      // so treasureData.shop_id = shopsRefTable[treasureData.shop]
      // FINALLY insert the formatted treasures data into the treasures table
    });

  // 1. grab data from db/data/dev-data - DONE
  // 2. seed shops table FIRST - DONE
  // 3. mutate treasuresData to add shop_id field
  // 4. seed treasures table w/new treasuresData
  // 5. profit
};

module.exports = seed;
