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
  test("ERROR 400:the method blocks SQL injections", () => {
    return request(app).get("/api/articles/1; DROP DATABASE").expect(400);
  });

  test("ERROR 400: returns an error when the id does not match", () => {
    return request(app)
      .get("/api/articles/90")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("ERROR 400: the method blocks an invalid id", () => {
    return request(app)
      .get("/api/articles/an-invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("PATCH 200: returns the edited article", () => {
    const testVotes = { inc_votes: 1000 };
    return request(app)
      .patch("/api/articles/1")
      .send(testVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body[0].votes >= 1000).toBe(true);
      });
  });
  test("PATCH 200: returns the edited article when votes are downvotes", () => {
    const testVotes = { inc_votes: -1000 };
    return request(app)
      .patch("/api/articles/1")
      .send(testVotes)
      .expect(200)
      .then(({ body }) => {
        //article with article_id one starts out with 100 votes. Thus when we subtract 1000 votes we get to -900.
        expect(body[0].votes === -900).toBe(true);
      });
  });
  test("ERROR 404: Throws an error when article_id does not exist", () => {
    const testVotes = { inc_votes: -1000 };
    return request(app)
      .patch("/api/articles/10000")
      .send(testVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("ERROR 400: Throws an error when the object sent does not have any keys", () => {
    const testVotes = {};
    return request(app)
      .patch("/api/articles/10000")
      .send(testVotes)
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
  test("POST 201: should post successfully the new comment", () => {
    const testComment = {
      body: "This is a test!",
      username: "butter_bridge",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(201)
      .then((response) => {
        expect(response.body).toMatchObject({
          comment_id: expect.any(Number),
          body: expect.any(String),
          article_id: 1,
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("ERROR 400: should return an error when the body is not a string", () => {
    const testComment = {
      body: 1234,
      username: "butter_bridge",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("ERROR 400: should return an error when the body does not exist", () => {
    const testComment = {
      //lack of body key
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("ERROR 400: should return an error when the username does not exist", () => {
    const testComment = {
      body: "test test",
      username: "1234",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("ERROR 404: should return an error when the article_id is valid but doesnt exist", () => {
    const testComment = {
      body: "This is a test!",
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1000/comments")
      .send(testComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("ERROR 400: should return an error when the article_id is not valid", () => {
    const testComment = {
      body: "This is a test!",
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/not-a-valid-id/comments")
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("TEST /api/comments/:comment_id", () => {
  test("DELETE 204: Returns status 204", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("ERROR 404: should throw an error when id does not exist", () => {
    return request(app)
      .delete("/api/comments/10000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment Not Found");
      });
  });
  test("ERROR 404: should throw an error when id is not valid", () => {
    return request(app)
      .delete("/api/comments/not-a-valid-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("TEST /api/users", () => {
  test("GET 200: returns an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        body.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
