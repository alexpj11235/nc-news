const chai = require("chai");
const { expect } = chai;
process.env.NODE_ENV = "test";
const app = require("../app");
const connection = require("../db/connection");
const request = require("supertest");
const chaiSorted = require("chai-sorted");
chai.use(chaiSorted);

beforeEach(() => connection.seed.run());

after(() => {
  connection.destroy();
});
describe("app", () => {
  describe("/:article_id GET", () => {
    describe("/api", () => {
      describe("/topics", () => {
        describe("GET", () => {
          it("status:200, responds with an object with an array of topics under key of topics", () => {
            return request(app)
              .get("/api/topics")
              .expect(200)
              .then(({ body: { topics } }) => {
                expect(topics).to.be.an("array");
                expect(topics).to.have.lengthOf(3);
                expect(topics[0].slug).to.be.a("string");
                expect(topics[0].description).to.be.a("string");
              });
          });
        });
      });
      describe("/users", () => {
        describe("/:username , GET", () => {
          it("status 200, responds with an object containing a user based on username, with user key", () => {
            return request(app)
              .get("/api/users/butter_bridge")
              .expect(200)
              .then(user => {
                expect(user.body.user[0]).to.deep.equal({
                  username: "butter_bridge",
                  avatar_url:
                    "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                  name: "jonny"
                });
              });
          });
        });
      });
      describe("/articles", () => {
        it("status 200, responds with an article object with correct article", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(res => {
              expect(res.body.article[0].article_id).to.equal(1);
            });
        });
        it("The article has comment_count, which is the total count of all the comment for this article_id", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(article => {
              expect(article.body.article[0].comment_count).to.equal(13);
            });
        });
      });

      describe("/:article_id PATCH", () => {
        it("status 200 ,changes the votes for a given article base on value provided, returns 1 article", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 1 })
            .expect(200)
            .then(article => {
              expect(article.body.article[0].votes).to.deep.equal(101);
              expect(article.body.article.length).to.equal(1);
            });
        });
      });
      describe("/:article_id/comment POST", () => {
        it("status 200, posts a comment to a given article, returns the posted comment", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({ username: "butter_bridge", body: "best. article. ever." })
            .expect(201)
            .then(comment => {
              expect(comment.body.comment[0].article_id).to.equal(1);
              expect(comment.body.comment[0].body).to.equal(
                "best. article. ever."
              );
              expect(comment.body.comment.length).to.equal(1);
            });
        });
      });
      describe("/:article_id/comments GET", () => {
        it("status 200 and responds with array of comments for given article", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(comments => {
              expect(comments.body).to.be.instanceOf(Array);
              expect(comments.body.length).to.equal(13);
              expect(comments.body).to.be.sortedBy("created_at", {
                descending: true
              });
            });
        });
        it("can be sorted by other columns when passed a valid column as a url sort_by query, order defaults to descending", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=author")
            .expect(200)
            .then(comments => {
              expect(comments.body).to.be.instanceOf(Array);
              expect(comments.body.length).to.equal(13);
              expect(comments.body).to.be.sortedBy("author", {
                descending: true
              });
            });
        });
        it("order can be changed, sorted_by defaults to created_at", () => {
          return request(app)
            .get("/api/articles/1/comments?order=asc")
            .expect(200)
            .then(comments => {
              expect(comments.body).to.be.instanceOf(Array);
              expect(comments.body.length).to.equal(13);
              expect(comments.body).to.be.sortedBy("created_at", {
                descending: false
              });
            });
        });
      });
      describe("GET", () => {
        it("returns an array of article object each has: author,title,art_id,topic,created_at,votes,comment_count, NO BODY", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(articles => {
              expect(articles.body).to.be.instanceOf(Array);
              expect(articles.body[0]).to.have.own.property("topic");
              expect(articles.body[0]).to.have.own.property("comment_count");
              expect(articles.body[0]).to.not.have.own.property("body");
            });
        });
        it("accepts queries: sort_by", () => {
          return request(app)
            .get("/api/articles?sort_by= author")
            .expect(200)
            .then(articles => {
              expect(articles.body).to.be.sortedBy("author", {
                descending: true
              });
            });
        });
        it("accepts queries: order", () => {
          return request(app)
            .get("/api/articles?order=asc")
            .expect(200)
            .then(articles => {
              expect(articles.body).to.be.sortedBy("created_at", {
                ascending: true
              });
            });
        });
        it("accepts queries: author", () => {
          return request(app)
            .get("/api/articles?author=butter_bridge")
            .expect(200)
            .then(articles => {
              expect(articles.body[1].author).to.equal("butter_bridge");
            });
        });
        it("accepts queries: topic", () => {
          return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(articles => {
              expect(articles.body[1].topic).to.equal("mitch");
            });
        });
      });
    });
  });
});
