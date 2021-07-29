const express = require('express');
const getTreasures = require('./controllers/treasures');
const app = express();

app.get('/api/treasures', getTreasures);

module.exports = app;
