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
        console.log(response.body);
        expect(typeof response.body[0].description).toBe("string");
        expect(typeof response.body[0].slug).toBe("string");
      });
  });
});
