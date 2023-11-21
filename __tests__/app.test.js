const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/");

const endpoints = require("../endpoints.json");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("Test /api/topics", () => {
  test("GET 200: Should return an array of topics to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBe(3);
      });
  });
  test("GET 200: Each item in the array of topics should have a string 'Description' and a string 'slug'", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(typeof response.body[0].description).toBe("string");
        expect(typeof response.body[0].slug).toBe("string");
        expect(typeof response.body[1].description).toBe("string");
        expect(typeof response.body[1].slug).toBe("string");
        expect(typeof response.body[2].description).toBe("string");
        expect(typeof response.body[2].slug).toBe("string");
      });
  });
});

describe("TEST /api", () => {
  test("GET 200: should return a list of the apis available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints);
      });
  });
});

describe("Test /api/articles/:article_id", () => {
  test("GET 200: returns the article chosen", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article_id).toBe(1);
        expect(body.title).toBe("Living in the shadow of a great man");
        expect(body.topic).toBe("mitch");
        expect(body.author).toBe("butter_bridge");
        expect(body.votes).toBe(100);
      });
  });
  test("the method blocks SQL injections", () => {
    return request(app).get("/api/articles/1; DROP DATABASE").expect(400);
  });

  test("GET 400: returns an error when the id does not match", () => {
    return request(app)
      .get("/api/articles/90")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("the method blocks an invalid id", () => {
    return request(app)
      .get("/api/articles/an-invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("TEST /api/articles", () => {
  test("GET 200 Should return an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
});

describe("TEST /api/articles/:article_id/comments", () => {
  test("GET 200: should return an array of comments coming with article id 1", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        body.forEach((comment) => {
          expect(comment.article_id).toBe(1);
          expect(comment.hasOwnProperty("comment_id")).toBe(true);
          expect(comment.hasOwnProperty("body")).toBe(true);
          expect(comment.hasOwnProperty("author")).toBe(true);
          expect(comment.hasOwnProperty("votes")).toBe(true);
          expect(comment.hasOwnProperty("created_at")).toBe(true);
        });
      });
  });
  test("GET 200: should return an array of comments in order of posting from most recent", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        let creationTime = Date.parse(body[0].created_at);
        body.forEach((comment) => {
          let commentDate = Date.parse(comment.created_at);
          expect(commentDate).toBeLessThanOrEqual(creationTime);

          creationTime = commentDate;
        });
      });
  });

  test("ERROR 400: should return an error when article_id is not valid", () => {
    return request(app)
      .get("/api/articles/not-a-valid-id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("ERROR 400: should return an error when article_id is valid but not existent", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not existent");
      });
  });
});
