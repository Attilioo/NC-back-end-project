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
        expect(body.hasOwnProperty("author"));
        expect(body.hasOwnProperty("title"));
        expect(body.hasOwnProperty("article_id"));
        expect(body.hasOwnProperty("body"));
        expect(body.hasOwnProperty("topic"));
        expect(body.hasOwnProperty("created_at"));
        expect(body.hasOwnProperty("votes"));
        expect(body.hasOwnProperty("article_img_url"));
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
});
