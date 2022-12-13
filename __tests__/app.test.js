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
          expect(review).toMatchObject({
            title: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.any(String),
            review_body: expect.any(String),
            category: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
            review_id: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("200 : Should order by descending as a default", () => {
    return request(app)
      .get("/api/reviews?order=desc")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe('"/api/reviews/:reviews_id', () => {
  describe("GET", () => {
    test("200: returns an object containing information on requested review ", () => {
      return request(app)
        .get("/api/reviews/3")
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toMatchObject({
            review_id: 3,
            title: "Ultimate Werewolf",
            designer: "Akihisa Okui",
            owner: "bainesface",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "We couldn't find the werewolf!",
            category: "social deduction",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 5,
          });
        });
    });
  });

  test("404: returns an error message when passed correct data type but a review_id that does not exist", () => {
    return request(app)
      .get("/api/reviews/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Review ID does not exist");
      });
  });

  test("400: returns an error message when passed an invalid data type", () => {
    return request(app)
      .get("/api/reviews/bananas")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid datatype found");
      });
  });
});
