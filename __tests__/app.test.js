const db = require('../db');
const seed = require('../db/seed.js');
const testData = require('../db/data/test-data');
const request = require('supertest');
const app = require('../app');

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe('GET /api/treasures', () => {
  it('it returns the treasures with a status of 200', () => {
    return request(app)
      .get('/api/treasures')
      .expect(200)
      .then((res) => {
        res.body.treasures.forEach((treasure) => {
          expect(treasure).toEqual(
            expect.objectContaining({
              treasure_id: expect.any(Number),
              treasure_name: expect.any(String),
              colour: expect.any(String),
              age: expect.any(Number),
              cost_at_auction: expect.any(Number),
              shop_name: expect.any(String),
            }),
          );
        });
      });
  });

  it('it returns treasures sorted by age in ascending order by default', () => {
    return request(app)
      .get('/api/treasures')
      .expect(200)
      .then((res) => {
        expect(res.body.treasures).toBeSortedBy('age', {
          ascending: true,
        });
      });
  });

  it('it returns treasures sorted by cost in a asc order', () => {
    return request(app)
      .get('/api/treasures?sort_by=cost_at_auction')
      .expect(200)
      .then((res) => {
        expect(res.body.treasures).toBeSortedBy('cost_at_auction', {
          ascending: true,
        });
      });
  });

  it('it returns treasures sorted by treasure_name in a asc order', () => {
    return request(app)
      .get('/api/treasures?sort_by=treasure_name')
      .expect(200)
      .then((res) => {
        expect(res.body.treasures).toBeSortedBy('treasure_name', {
          ascending: true,
        });
      });
  });

  it('it returns treasures sorted by age in desc order', () => {
    return request(app)
      .get('/api/treasures?order=desc')
      .expect(200)
      .then((res) => {
        expect(res.body.treasures).toBeSortedBy('age', {
          descending: true,
        });
      });
  });
});
