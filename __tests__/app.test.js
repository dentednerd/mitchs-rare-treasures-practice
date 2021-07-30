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

  it('it returns 400 if provided an invalid sort by', () => {
    return request(app)
      .get('/api/treasures?sort_by=cabbage')
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe('Invalid sort by value');
      });
  });

  it('it returns 400 if provided an invalid sort order', () => {
    return request(app)
      .get('/api/treasures?order=cabbage')
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe('Invalid sort order value');
      });
  });

  it('it returns items of a given colour when provided the colour in a query, with a status 200', () => {
    return request(app)
      .get('/api/treasures?colour=gold')
      .expect(200)
      .then((res) => {
        res.body.treasures.forEach((treasure) => {
          expect(treasure).toEqual(
            expect.objectContaining({
              treasure_id: expect.any(Number),
              treasure_name: expect.any(String),
              age: expect.any(Number),
              cost_at_auction: expect.any(Number),
              shop_name: expect.any(String),
              colour: 'gold',
            }),
          );
        });
      });
  });
});

describe('POST /api/treasures', () => {
  it('it returns a new treasure to the database', () => {
    return request(app)
      .post('/api/treasures')
      .send({
        treasure_name: 'ruby keyboard',
        colour: 'ruby',
        age: 5,
        cost_at_auction: '1001.00',
        shop_id: 1,
      })
      .expect(201)
      .then((res) => {
        expect(res.body.treasure).toEqual({
          treasure_id: expect.any(Number),
          treasure_name: 'ruby keyboard',
          colour: 'ruby',
          age: 5,
          cost_at_auction: 1001.0,
          shop_id: 1,
        });
      });
  });

  it('it returns error status when passed invalid data', () => {
    return request(app)
      .post('/api/treasures')
      .send({
        treasure_name: 'ruby keyboard',
        colour: 5,
        age: 'dog',
        cost_at_auction: '1001.00',
        shop_id: 'dog',
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({
          msg: 'Treasure not added, invalid data',
        });
      });
  });
});

describe('PATCH /api/treasures/:treasure_id', () => {
  it('it updates the cost of a given treasure', () => {
    return request(app)
      .patch('/api/treasures/2')
      .send({
        cost_at_auction: '4',
      })
      .expect(200)
      .then((res) => {
        expect(res.body.treasure).toEqual({
          age: 100,
          colour: 'azure',
          cost_at_auction: 4,
          treasure_id: 2,
          treasure_name: 'treasure-d',
          shop_id: 2,
        });
      });
  });
});
