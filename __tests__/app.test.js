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
        categories.forEach(category => {
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

describe.only("/api/reviews", () => {
  test("GET - status: 200, responds with an array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews.length).toBe(13);
        reviews.forEach(review => {
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
            comment_count: expect.any(Number),
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
  test("200 : should get reviews by category", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews.length > 0).toBe(true);
        reviews.forEach(review => {
          expect(review).toHaveProperty("category", "dexterity");
        });
      });
  });
});
test("200: returns an empty array when the query exists but has no reviews", () => {
  return request(app)
    .get("/api/reviews?category=children's+games")
    .expect(200)
    .then(({ body }) => {
      const { reviews } = body;
      expect(reviews).toEqual([]);
    });
});
test("404: returns a message when there is a category which does not exist", () => {
  return request(app)
    .get("/api/reviews?category=banana")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("banana not found");
    });
});
test(" 200 - returns array of reviews sorted by comment_count in descending order", () => {
  return request(app)
    .get("/api/reviews?sort_by=comment_count")
    .expect(200)
    .then(({ body }) => {
      const { reviews } = body;
      expect(reviews).toBeSortedBy("comment_count", {
        descending: true,
      });
    });
});
test("200 - returns array of reviews sorted by created_at by defualt in asccending order", () => {
  return request(app)
    .get("/api/reviews?order=asc")
    .expect(200)
    .then(({ body }) => {
      const { reviews } = body;
      expect(reviews).toBeSortedBy("created_at", {
        descending: false,
      });
    });
});
test("200 - returns array of reviews in ascending order", () => {
  return request(app)
    .get("/api/reviews?order=asc")
    .expect(200)
    .then(({ body }) => {
      const { reviews } = body;
      expect(reviews).toBeSortedBy("created_at", { descending: false });
    });
});

test("200 - returns array of reviews in filtered by category", () => {
  return request(app)
    .get("/api/reviews?category=dexterity")
    .expect(200)
    .then(({ body }) => {
      const { reviews } = body;
      reviews.forEach(review => {
        expect(review.category).toBe("dexterity");
      });
    });
});
test("ERROR - status 400 - returns bad request when sorting by non-existent column", () => {
  return request(app)
    .get("/api/reviews?sort_by=nocolumn")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Sort_by value does not exist");
    });
});
test("ERROR - status 400 - returns bad request when ordering by something other than ASC or DESC", () => {
  return request(app)
    .get("/api/reviews?order=banana")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Order does not exist - use asc or desc");
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
describe("GET /api/reviews/:review_id/comments", () => {
  test("200: responds with array of comments related to given review_id sorted by most recent first", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(3);
        expect(comments).toBeSortedBy("created_at", {
          descending: false,
          coerce: true,
        });
        comments.forEach(comment => {
          expect(comment).toMatchObject(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: 3,
            })
          );
        });
      });
  });
  test("200: responds with an empty array when review_id has no related comments and message", () => {
    return request(app)
      .get("/api/reviews/6/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(0);
      });
  });
  test("404: returns an error message when passed correct data type but a review_id that does not exist", () => {
    return request(app)
      .get("/api/reviews/765564/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Review ID does not exist");
      });
  });
  test("400: responds with correct error status when invalid datatype used", () => {
    return request(app)
      .get("/api/reviews/bananaaaa/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid datatype found");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("201: responds with the posted comment", () => {
    const newComment = { username: "mallionaire", body: "I love this game!" };
    return request(app)
      .post("/api/reviews/4/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject(
          expect.objectContaining({
            comment_id: 7,
            body: "I love this game!",
            votes: 0,
            author: "mallionaire",
            review_id: 4,
            created_at: expect.any(String),
          })
        );
      });
  });
  test("400: responds with error message when username is not given", () => {
    const newComment = { body: "banana" };
    return request(app)
      .post("/api/reviews/5/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Username required");
      });
  });
  test("400: responds with error message when body is not given", () => {
    const newComment = { username: "banana" };
    return request(app)
      .post("/api/reviews/5/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Body required");
      });
  });
  test("400: responds with error message when username does not exist", () => {
    const newComment = { username: "banana", body: "test12345" };
    return request(app)
      .post("/api/reviews/5/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Review ID does not exist");
      });
  });
  test("404: returns an error message when passed correct data type but a review_id that does not exist", () => {
    const newComment = { username: "mallionaire", body: "I love this game!" };
    return request(app)
      .post("/api/reviews/123456789/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Review ID does not exist");
      });
  });
  test("400: responds with correct error status when invalid datatype used", () => {
    const newComment = { username: "mallionaire", body: "I love this game !" };
    return request(app)
      .post("/api/reviews/test/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid datatype found");
      });
  });
  test("201: responds with the posted comment and ignores addiotnal properties in the comment", () => {
    const newComment = {
      username: "mallionaire",
      body: "I love this game!",
      email: "Johnparker123@gmail.com",
      city: "Manchester",
    };
    return request(app)
      .post("/api/reviews/4/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject(
          expect.objectContaining({
            comment_id: 7,
            body: "I love this game!",
            votes: 0,
            author: "mallionaire",
            review_id: 4,
            created_at: expect.any(String),
          })
        );
      });
  });
});

const users = require("../db/data/test-data/users");
describe("PATCH /api/reviews/review_id", () => {
  test("200: respond with review object with votes property correctly incremented", () => {
    const votes = { inc_votes: 1 };
    return request(app)
      .patch("/api/reviews/4")
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toMatchObject({
          review_id: 4,
          title: "Dolor reprehenderit",
          designer: "Gamey McGameface",
          owner: "mallionaire",
          review_img_url:
            "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          review_body:
            "Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod",
          category: "social deduction",
          created_at: "2021-01-22T11:35:50.936Z",
          votes: 8,
        });
      });
  });

  test("404: responds with correct error status when invalid review_id is used", () => {
    return request(app)
      .get("/api/reviews/66")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Review ID does not exist");
      });
  });

  test("200: respond with review object with votes property correctly incremented - going into negatives", () => {
    const votes = { inc_votes: -100 };
    return request(app)
      .patch("/api/reviews/6")
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toEqual({
          review_id: 6,
          title: "Occaecat consequat officia in quis commodo.",
          designer: "Ollie Tabooger",
          owner: "mallionaire",
          review_img_url:
            "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          review_body:
            "Fugiat fugiat enim officia laborum quis. Aliquip laboris non nulla nostrud magna exercitation in ullamco aute laborum cillum nisi sint. Culpa excepteur aute cillum minim magna fugiat culpa adipisicing eiusmod laborum ipsum fugiat quis. Mollit consectetur amet sunt ex amet tempor magna consequat dolore cillum adipisicing. Proident est sunt amet ipsum magna proident fugiat deserunt mollit officia magna ea pariatur. Ullamco proident in nostrud pariatur. Minim consequat pariatur id pariatur adipisicing.",
          category: "social deduction",
          created_at: "2020-09-13T14:19:28.077Z",
          votes: -92,
        });
      });
  });
  test("400: returns an error message when passed an invalid data type", () => {
    const votes = { inc_votes: "banana" };
    return request(app)
      .patch("/api/reviews/5")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid datatype found");
      });
  });
  test("404: returns an error message when when passed correct data type but a review_id that does not exist", () => {
    const votes = { inc_votes: 10 };
    return request(app)
      .patch("/api/reviews/10000")
      .send(votes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Review ID does not exist");
      });
  });
  test("400: return an error message when inc-votes is missing", () => {
    const votes = { inc_votes: {} };
    return request(app)
      .patch("/api/reviews/5")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid datatype found");
      });
  });
});
describe("/api/users", () => {
  test("GET - STATUS: 200, responds with an array of the newly inserted user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(users).toHaveLength(4);
        users.forEach(user => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("404: responds with correct error status when invalid path has been used", () => {
    return request(app)
      .get("/api/userusersss")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Path");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("204: Should delete comment with associated id ", () => {
    const comment_id = 1;
    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(204)
      .then(() => {
        return request(app)
          .delete(`/api/comments/${comment_id}`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(`${comment_id} does not exist`);
          });
      });
  });
  test("400:responds with correct error status when invalid datatype used", () => {
    const comment_id = "banana";
    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid datatype found");
      });
  });
  test("404: returns an error message when passed correct data type but a comment_id that does not exist", () => {
    const comment_id = 981;
    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`${comment_id} does not exist`);
      });
  });
});
