
const request = require('supertest');
const app = require('./app');

describe('GET /', () => {
  it('should return Hello, Nidhi! with status 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Hello, Nidhi!');
  });
});

