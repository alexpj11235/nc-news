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
  describe("", () => {
    describe("/api", () => {
      describe("/topics", () => {
        describe("GET", () => {
          it("status:405", () => {
            const invalidMethods = ["patch", "put", "delete"];
            const methodPromises = invalidMethods.map(method => {
              return request(app)
                [method]("/api/topics")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("Method Not Allowed");
                });
            });

            return methodPromises;
          });

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
          it("status 200, responds with an object containing a user based on username under key user, with user key", () => {
            return request(app)
              .get("/api/users/butter_bridge")
              .expect(200)
              .then(res => {
                expect(res.body.user[0]).to.deep.equal({
                  username: "butter_bridge",
                  avatar_url:
                    "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                  name: "jonny"
                });
              });
          });
          it("status 404 and message user not found if invalid id given", () => {
            return request(app)
              .get("/api/users/99")
              .expect(404)
              .then(res => {
                expect(res.body.msg).to.equal("user not found");
              });
          });
        });
      });
      describe("/articles/:article_id GET", () => {
        it("status 200, responds with an article object with correct article", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(res => {
              expect(res.body.article_id).to.equal(1);
            });
        });
        it("The article has comment_count, which is the total count of all the comment for this article_id", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(res => {
              expect(res.body.comment_count).to.equal(13);
            });
        });
        it("status 404 and message article not found when valid but non-existent id given", () => {
          return request(app)
            .get("/api/articles/99")
            .expect(404)
            .then(res => {
              expect(res.body.msg).to.equal("article not found");
            });
        });
        it("status 400 and message article not valid when invalid id given", () => {
          return request(app)
            .get("/api/articles/notvalid")
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal("article not valid");
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
        it("status 404 and message article not found if valid but non-existent id given", () => {
          return request(app)
            .patch("/api/articles/99")
            .send({ inc_votes: 1 })
            .expect(404)
            .then(res => {
              expect(res.body.msg).to.equal("article not found");
            });
        });
        it("status 400 and message, patch must include valid inc_votes when no valid inc_votes given", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ notvotes: 1 })
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal(
                "patch must include valid inc_votes"
              );
            });
        });
      });
      describe("/:article_id/comments POST", () => {
        it("status 201, posts a comment to a given article, returns the posted comment", () => {
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

        it("status 404 and message article not found if valid but non-existent id given", () => {
          return request(app)
            .post("/api/articles/99/comments")
            .send({ username: "butter_bridge", body: "best. article. ever." })
            .expect(404)
            .then(res => {
              expect(res.body.msg).to.equal("article not found");
            });
        });
        it("status 400 and message article not valid if invalid id given", () => {
          return request(app)
            .post("/api/articles/porridge/comments")
            .send({ username: "butter_bridge", body: "best. article. ever." })
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal("article not valid");
            });
        });
        it("status 400 and message post must have username and body when given a bad post ", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({ notusername: "butter_bridge", notbody: "badbadpost" })
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal("post must have username and body");
            });
        });
      });
      describe("/:article_id/comments GET", () => {
        it("status 404 and message article not found if valid but non-existent id given", () => {
          return request(app)
            .get("/api/articles/99/comments")
            .expect(404)
            .then(res => {
              expect(res.body.msg).to.equal("article not found");
            });
        });
        it("status 400 and message article not valid if invalid id given", () => {
          return request(app)
            .get("/api/articles/porridge/comments")
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal("article not valid");
            });
        });
        it("status 200 and empty array if article exists with no comments ", () => {
          return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.deep.equal([]);
            });
        });

        it("status 200 and responds with array of comments for given article", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.instanceOf(Array);
              expect(res.body.comments.length).to.equal(13);
              expect(res.body.comments).to.be.sortedBy("created_at", {
                descending: true
              });
            });
        });
        it("can be sorted by other columns when passed a valid column as a url sort_by query, order defaults to descending", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=author")
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.instanceOf(Array);
              expect(res.body.comments.length).to.equal(13);
              expect(res.body.comments).to.be.sortedBy("author", {
                descending: true
              });
            });
        });
        it("status 400 and message sort_by column not found when given invalid sort_by ", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=notvalidsort")
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal("sort_by column not found");
            });
        });
        it("order can be changed, sorted_by defaults to created_at", () => {
          return request(app)
            .get("/api/articles/1/comments?order=asc")
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.instanceOf(Array);
              expect(res.body.comments.length).to.equal(13);
              expect(res.body.comments).to.be.sortedBy("created_at", {
                descending: false
              });
            });
        });
      });
      describe("/articles GET ", () => {
        it("returns an object with key of articles for array of articles, each has: author,title,art_id,topic,created_at,votes,comment_count, NO BODY", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(articles => {
              expect(articles.body).to.have.own.property("articles");
              expect(articles.body.articles[0]).to.have.own.property("topic");
              expect(articles.body.articles[0]).to.have.own.property(
                "comment_count"
              );
              expect(articles.body.articles[0]).to.not.have.own.property(
                "body"
              );
            });
        });
        it("accepts queries: sort_by", () => {
          return request(app)
            .get("/api/articles?sort_by=author")
            .expect(200)
            .then(articles => {
              expect(articles.body.articles).to.be.sortedBy("author", {
                descending: true
              });
            });
        });
        it("accepts queries: order", () => {
          return request(app)
            .get("/api/articles?order=asc")
            .expect(200)
            .then(articles => {
              expect(articles.body.articles).to.be.sortedBy("created_at", {
                ascending: true
              });
            });
        });
        it("accepts queries: author", () => {
          return request(app)
            .get("/api/articles?author=butter_bridge")
            .expect(200)
            .then(articles => {
              expect(articles.body.articles[1].author).to.equal(
                "butter_bridge"
              );
            });
        });
        it("accepts queries: topic", () => {
          return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(articles => {
              expect(articles.body.articles[1].topic).to.equal("mitch");
            });
        });
        it("status 404 and msg topic not found when given not a topic", () => {
          return request(app)
            .get("/api/articles?topic=notatopic")
            .expect(404)
            .then(res => {
              expect(res.body.msg).to.equal("topic not found");
            });
        });

        it("status 404 and msg author not found when given not an author", () => {
          return request(app)
            .get("/api/articles?author=notanauthor")
            .expect(404)
            .then(res => {
              expect(res.body.msg).to.equal("author not found");
            });
        });
        it("status 400 and msg sort_by column not found when given invalid sort_by", () => {
          return request(app)
            .get("/api/articles?sort_by=notvalidsort")
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal("sort_by column not found");
            });
        });
      });
      describe.only("/comments/:comment_id patch", () => {
        it("status 200 ,changes the votes for a given comment base on id provided, returns the patched commment", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 2 })
            .expect(200)
            .then(res => {
              expect(res.body.comment[0].votes).to.deep.equal(18);
              expect(res.body.comment.length).to.equal(1);
            });
        });
      });
    });
  });
});
