const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");

const data = require("../db/data/test-data/");

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

describe("Test /api", () => {
  test("should return a list of the apis available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        console.log(body);
        expect(body.hasOwnProperty("GET /api")).toBe(true);
        expect(body.hasOwnProperty("GET /api/topics")).toBe(true);
        expect(body.hasOwnProperty("GET /api/articles")).toBe(true);
        expect(body.hasOwnProperty("GET /api/comments")).toBe(true);
        expect(body.hasOwnProperty("GET /api/users")).toBe(true);

        expect(body["GET /api"].hasOwnProperty("description"));
        expect(body["GET /api/topics"].hasOwnProperty("description"));
        expect(body["GET /api/topics"].hasOwnProperty("queries"));
        expect(body["GET /api/topics"].hasOwnProperty("exampleResponse"));
      });
  });
});
