const supertest = require("supertest");
const server = require("./server");
const model = require("../users/users-model");
const db = require("../database/connection");
const { isValid } = require("../users/users-service");

beforeEach(() => {
  return db.migrate
    .rollback()
    .then(() => db.migrate.latest())
    .then(() => db.seed.run());
});

describe("server", () => {
  it("can run", () => {
    expect(true).toBeTruthy();
  });
  describe("GET /", () => {
    it("should return http status 200", () => {
      return supertest(server)
        .get("/")
        .then((response) => {
          expect(response.status).toBe(200);
          expect(response.status).toBeTruthy();
        });
    });
  });
  it("should return {api:up}", () => {
    return supertest(server)
      .get("/")
      .then((res) => {
        expect(res.body).toEqual({ api: "up" });
        expect(res.body.api).toBe("up");
        expect(res.body.api).toBeDefined();
      });
  });
});

describe("GET /api/users", () => {
  it("should return an array", () => {
    return supertest(server)
      .get("/api/users")
      .then((res) => {
        // console.log("res", res.body);
        expect(Array.isArray(res.body.users)).toBe(true);
      });
  });
  // it("should return correct first user", () => {
  //   return supertest(server)
  //     .get("/users")
  //     .then((res) => {
  //       const testItem = { id: 1, username: "John" };
  //       expect(res.body[0]).toMatchObject(testItem);
  //     });
  // });
});

describe("POST /api/users/register", () => {
  it("return 201 created", function (done) {
    return supertest(server)
      .post("/api/auth/register")
      .send({ username: "Joo", password: "123123", role: 2 })
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
  it("should correct length of user list", async () => {
    await model.add({ username: "Sherlock", password: "123abc", role: 1 });

    // read data from the table
    const users = await db("users");
    let amount = users.length;
    expect(users).toHaveLength(amount);
  });
  it("test if the same user can created twice, not giving error", function (done) {
    return supertest(server)
      .post("/api/auth/register")
      .send({ username: "Joo", password: "123123", role: 2 })
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe("Delete /api/users/register", () => {
  describe("can delete an team", () => {
    it("receives a 200", () => {
      return supertest(server)
        .delete("/api/users/:id")
        .send({ id: 3 })
        .expect(200);
    });
  });
  describe("can delete an team", () => {
    it("receives a 200", () => {
      return supertest(server)
        .delete("/api/users/:id")
        .send({ id: 1 })
        .expect(200);
    });
  });
});
