const request = require("supertest");
const app = require("../app");
const sortedJest = "jest-sorted";

const seed = require("../db/seeds/seed");
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../db/data/test-data/index");

const db = require("../db/connection");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed({ categoryData, commentData, reviewData, userData });
});

afterAll(() => {
  return db.end();
});

describe("app", () => {
  describe("/api", () => {
    it("responds with an object with the properties describing every available endpoint", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.endpoints).toEqual(endpoints);
        });
    });
  });
  describe("/api/categories", () => {
    it("200 GET - responds with and array of category objects with the correct properties", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          expect(body.categories).toBeInstanceOf(Array);
          expect(body.categories).toHaveLength(4);
          body.categories.forEach((category) => {
            expect(category).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
  });
  describe("/api/reviews", () => {
    it("200 GET - responds with and array of review objects with the correct properties", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews).toBeInstanceOf(Array);
          expect(body.reviews).toHaveLength(13);
          body.reviews.forEach((review) => {
            expect(review).toMatchObject({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
          expect(body.reviews).toBeSortedBy("created_at", { descending: true });
        });
    });

    it("adds the correct number to comment_count property", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews[5].comment_count).toBe(3);
        });
    });
    describe("/api/reviews?query", () => {
      it("responds with the correct reviews/review when a ?category query is added", () => {
        return request(app)
          .get("/api/reviews?category=dexterity")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeInstanceOf(Array);
            expect(body.reviews).toHaveLength(1);
            expect(body.reviews[0]).toMatchObject({
              review_id: 2,
              title: "Jenga",
              designer: "Leslie Scott",
              owner: "philippaclaire9",
              review_img_url:
                "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
              review_body: "Fiddly fun for all the family",
              category: "dexterity",
              created_at: "2021-01-18T10:01:41.251Z",
              votes: 5,
              comment_count: expect.any(Number),
            });
          });
      });
      it("responds with reviews sorted by the column in the ?sort_by query", () => {
        return request(app)
          .get("/api/reviews/?category=social deduction&sort_by=review_id")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toHaveLength(11);
            expect(body.reviews).toBeSortedBy("review_id", {
              descending: true,
            });
          });
      });
      it("responds with reviews in the correct order when given an ?order_by query", () => {
        return request(app)
          .get("/api/reviews?category=social deduction&sort_by=title&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toHaveLength(11);
            expect(body.reviews).toBeSortedBy("title", { descending: false });
          });
      });
      it("responds to an invalid sort_by query with a 400 code and an error message 'Invalid Request'", () => {
        return request(app)
          .get("/api/reviews?sort_by=not-a-valid-sort-query")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid Request");
          });
      });
      it("responds to an invalid order_by query with a 400 code and an error message 'Invalid Request'", () => {
        return request(app)
          .get("/api/reviews?order=not-a-valid-order-query")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid Request");
          });
      });
      it("responds to a valid category query with no entry in the database with a 404 code and an error message 'Not Found'", () => {
        return request(app)
          .get("/api/reviews?category=not-currently-a-category")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not Found");
          });
      });
      it("responds with an empty array if there are no reviews that have the searched for category", () => {
        return request(app)
          .get("/api/reviews?category=children's games")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toEqual([]);
          });
      });
    });
  });
  describe("/api/reviews/:review_id", () => {
    it("200: GET responds to a valid request with the review object with all the correct properties including the comment_count", () => {
      return request(app)
        .get("/api/reviews/3")
        .expect(200)
        .then(({ body }) => {
          const { review } = body;
          expect(review).toMatchObject({
            category: "social deduction",
            comment_count: 3,
            created_at: "2021-01-18T10:01:41.251Z",
            designer: "Akihisa Okui",
            owner: "bainesface",
            review_body: "We couldn't find the werewolf!",
            review_id: 3,
            review_img_url:
              "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700",
            title: "Ultimate Werewolf",
            votes: 5,
          });
        });
    });
    it("responds to an invalid review_id with a 400 code and an error message 'Invalid Request'", () => {
      return request(app)
        .get("/api/reviews/definitely-not-an-id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Request");
        });
    });
    it("responds to an review_id with no entry in the database with with a 404 code and an error message 'Not Found'", () => {
      return request(app)
        .get("/api/reviews/9999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
    it("200: PATCH responds with a 200 code and the review object with the vote property INCREASED by the given amount", () => {
      const voteRequest = {
        inc_votes: 10,
      };
      const expectedResponse = {
        review_id: 1,
        title: "Agricola",
        review_body: "Farmyard fun!",
        designer: "Uwe Rosenberg",
        review_img_url:
          "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
        votes: 11,
        category: "euro game",
        owner: "mallionaire",
        created_at: "2021-01-18T10:00:20.514Z",
      };
      return request(app)
        .patch("/api/reviews/1")
        .send(voteRequest)
        .expect(200)
        .then(({ body }) => {
          expect(body.patchedReview).toMatchObject(expectedResponse);
        });
    });
    it("200: PATCH responds with a 200 code and the review object with the vote property DECREASED by the given amount", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: -10 })
        .expect(200)
        .then(({ body }) => {
          expect(body.patchedReview.votes).toBe(-9);
        });
    });
    it("PATCH: responds to an invalid review_id with a 400 code and an error message 'Invalid Request'", () => {
      const voteRequest = {
        inc_votes: 10,
      };
      return request(app)
        .patch("/api/reviews/definitely-not-an-id")
        .send(voteRequest)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Request");
        });
    });
    it("PATCH: responds to an review_id with no entry in the database with with a 404 code and an error message 'Not Found'", () => {
      const voteRequest = {
        inc_votes: 10,
      };
      return request(app)
        .patch("/api/reviews/9999")
        .send(voteRequest)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
    it("responds to an invalid request body with a 400 code and an error message 'Invalid Request'", () => {
      const invalidRequestBody = {
        votes: "not a number",
      };
      return request(app)
        .patch("/api/reviews/1")
        .send(invalidRequestBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Request");
        });
    });
  });
  describe("/api/reviews/:review_id/comments", () => {
    it("200: GET responds with an array of comment objects with the correct properties", () => {
      return request(app)
        .get("/api/reviews/3/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toHaveLength(3);
          body.comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: expect.any(Number),
            });
          });
          expect(body.comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    it("responds to an invalid review_id with a 400 code and an error message 'Invalid Request'", () => {
      return request(app)
        .get("/api/reviews/not-a-review-id/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Request");
        });
    });
    it("responds to an review_id with no entry in the database with a 404 code and an error message 'Not Found'", () => {
      return request(app)
        .get("/api/reviews/9999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
  });
  describe("/api/reviews/:review_id/comments", () => {
    it("201: POST responds with a 201 code and the comment object that was added. The votes property should also be returned with a value of 0", () => {
      const requestBody = {
        username: "dav3rid",
        body: "Great game! Going to recommend to everyone I know!",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(requestBody)
        .expect(201)
        .then(({ body }) => {
          expect(body.postedComment).toMatchObject({
            comment_id: expect.any(Number),
            body: "Great game! Going to recommend to everyone I know!",
            votes: 0,
            author: "dav3rid",
            review_id: expect.any(Number),
            created_at: expect.any(String),
          });
        });
    });
    it("responds to an invalid review_id with a 400 code and an error message 'Invalid Request", () => {
      const requestBody = {
        username: "dav3rid",
        body: "Great game! Going to recommend to everyone I know!",
      };
      return request(app)
        .post("/api/reviews/not-a-review-id/comments")
        .send(requestBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Request");
        });
    });
    it("responds to an review_id with no entry in the database with a 404 code and an error message 'Not Found'", () => {
      const requestBody = {
        username: "dav3rid",
        body: "Great game! Going to recommend to everyone I know!",
      };
      return request(app)
        .post("/api/reviews/9999/comments")
        .send(requestBody)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
    it("responds to an invalid request body with a 400 code and an error message 'Invalid Request'", () => {
      const invalidRequestBody = {
        invalidUser: "notausername",
        invalidBody: 10000000,
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(invalidRequestBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Request");
        });
    });
  });
  describe("/api/comments/:comment_id", () => {
    it("204 DELETE - responds with a 204 code", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    it("responds to an comment_id with no entry in the database with a 404 code and an error message 'Not Found'", () => {
      return request(app)
        .delete("/api/comments/9999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
    it("responds to an invalid comment_id with a 400 code and an error message 'Invalid Request", () => {
      return request(app)
        .delete("/api/comments/not-a-valid-comment-id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Request");
        });
    });
    it("200: PATCH responds with a 200 code and the comment object with the vote property INCREASED by the given amount", () => {
      const voteRequest = {
        inc_votes: 10,
      };
      const expectedResponse = {
        body: "I loved this game too!",
        votes: 26,
        author: "bainesface",
        review_id: 2,
        created_at: "2017-11-22T12:43:33.389Z",
      };
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 10 })
        .expect(200)
        .then(({ body }) => {
          expect(body.patchedComment).toMatchObject(expectedResponse);
        });
    });
    it("200: PATCH responds with a 200 code and the comment object with the vote property DECREASED by the given amount", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: -10 })
        .expect(200)
        .then(({ body }) => {
          expect(body.patchedComment.votes).toBe(6);
        });
    });
    it("PATCH: responds to an invalid comment_id with a 400 code and an error message 'Invalid Request'", () => {
      const voteRequest = {
        inc_votes: 10,
      };
      return request(app)
        .patch("/api/comments/definitely-not-an-id")
        .send(voteRequest)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Request");
        });
    });
    it("PATCH: responds to an comment_id with no entry in the database with with a 404 code and an error message 'Not Found'", () => {
      const voteRequest = {
        inc_votes: 10,
      };
      return request(app)
        .patch("/api/comments/9999")
        .send(voteRequest)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
    it("responds to an invalid request body with a 400 code and an error message 'Invalid Request'", () => {
      const invalidRequestBody = {
        votes: "not a number",
      };
      return request(app)
        .patch("/api/comments/1")
        .send(invalidRequestBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Request");
        });
    });
  });
  describe("/api/users", () => {
    it("200 GET - responds with and array of user objects with the correct properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users).toBeInstanceOf(Array);
          expect(body.users).toHaveLength(4);
          body.users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
    describe("/api/users/:username", () => {
      it("200 GET - responds with a user object with the correct properties", () => {
        return request(app)
          .get("/api/users/bainesface")
          .then(({ body }) => {
            const { user } = body;
            expect(user).toMatchObject({
              username: "bainesface",
              avatar_url:
                "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
              name: "sarah",
            });
          });
      });
      it("responds to a username with no entry in the database with with a 404 code and an error message 'Not Found'", () => {
        return request(app)
          .get("/api/users/not-a-username")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not Found");
          });
      });
    });
  });
});
