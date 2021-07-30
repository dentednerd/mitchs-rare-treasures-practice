const express = require('express');
const {
  getTreasures,
  addTreasure,
  editTreasure,
} = require('./controllers/treasures');
const app = express();

app.use(express.json());
app.get('/api/treasures', getTreasures);
app.post('/api/treasures', addTreasure);
app.patch('/api/treasures/:treasure_id', editTreasure);

module.exports = app;
