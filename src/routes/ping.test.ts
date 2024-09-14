import { expect } from "chai";
import { build } from "../server.js";
import type { FastifyInstance } from "fastify";
import type { Response } from "light-my-request";

describe("Ping Route", () => {
  let app: FastifyInstance;
  before(async () => {
    app = build();
    await app.ready();
  });
  describe("GET /ping", () => {
    let response: Response;
    before(async () => {
      response = await app.inject({
        method: "GET",
        url: "/ping",
        query: { hello: "world" },
      });
    });
    it("returns status 200", async () => {
      expect(response).have.property("statusCode", 200);
    });
    it("returns query", async () => {
      expect(response).to.have.property("body");
      expect(JSON.parse(response.body)).to.have.property("hello", "world");
    });
  });
  describe("POST /ping", () => {
    let response: Response;
    before(async () => {
      response = await app.inject({
        method: "POST",
        url: "/ping",
        headers: {
          "x-api-key": process.env.APIKEY,
        },
        body: { hello: "world" },
      });
    });
    it("returns status 200", async () => {
      expect(response).have.property("statusCode", 200);
    });
    it("returns query", async () => {
      expect(response).to.have.property("body");
      expect(JSON.parse(response.body)).to.have.property("hello", "world");
    });
  });
  after(async () => {
    await app.close();
  });
});
