const db = require('../db');
const seed = require('../db/seed.js');
const testData = require('../db/data/test-data');

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe('Mitch treasures', () => {
  it('is a database', () => {
    console.log('hi');
  })
});
