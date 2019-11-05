const chai = require("chai");
const { expect } = chai;
process.env.NODE_ENV = "test";
const app = require("../app");
const connection = require("../db/connection");
const request = require("supertest");
// const chaiSorted = require("chai-sorted");
// chai.use(chaiSorted);

beforeEach(() => connection.seed.run());

after(() => {
  connection.destroy();
});

describe("app", () => {
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
  });
});
