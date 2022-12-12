const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/categories", () => {
  test("GET - STATUS: 200, responds with an array of the newly inserted Category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body: { categories } }) => {
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

test("ERROR - status:404, response to an error message when passed the wrong route", () => {
  return request(app)
    .get("/api/InvalidPath")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid Path");
    });
});

describe("/api/reviews", () => {
  test("GET - status: 200, responds with an array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews.length).toEqual(13);
        reviews.forEach((review) => {
          expect(review).toHaveProperty("comment_count");
          expect(review).toMatchObject({
            title: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.any(String),
            review_body: expect.any(String),
            category: expect.any(String),
            votes: expect.any(Number),
          });
        });
      });
  });
});
