import { expect } from "chai";
import { build } from "../server.js";
import type { FastifyInstance } from "fastify";
import { env } from "node:process";
import { IncomingHttpHeaders } from "node:http";

describe("Auth Plugin", () => {
  let app: FastifyInstance;
  before(async () => {
    app = build();
    await app.ready();
  });
  describe("No API Key Included", () => {
    const obj = { hello: "there" };
    it("GET returns 200", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/ping",
        query: obj,
      });
      expect(response).have.property("statusCode", 200);
    });
    it("Head returns 200", async () => {
      const response = await app.inject({
        method: "HEAD",
        url: "/ping",
        headers: obj,
      });
      expect(response).have.property("statusCode", 200);
    });
    it("POST returns 401", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/ping",
        body: obj,
      });
      expect(response).have.property("statusCode", 401);
    });
    it("PATCH returns 401", async () => {
      const response = await app.inject({
        method: "PATCH",
        url: "/ping",
        headers: obj,
      });
      expect(response).have.property("statusCode", 401);
    });
    it("DELETE returns 401", async () => {
      const response = await app.inject({
        method: "DELETE",
        url: "/ping",
        headers: obj,
      });
      expect(response).have.property("statusCode", 401);
    });
  });
  describe("With API Key Included", () => {
    const obj = { hello: "again" };
    const secureHeader: IncomingHttpHeaders = { "x-api-key": env.APIKEY };
    it("POST returns 200", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/ping",
        body: obj,
        headers: secureHeader,
      });
      expect(response).have.property("statusCode", 200);
    });
    it("PATCH returns 200", async () => {
      const response = await app.inject({
        method: "PATCH",
        url: "/ping",
        body: obj,
        headers: secureHeader,
      });
      expect(response).have.property("statusCode", 200);
    });
    it("DELETE returns 200", async () => {
      const response = await app.inject({
        method: "DELETE",
        url: "/ping",
        body: obj,
        headers: secureHeader,
      });
      expect(response).have.property("statusCode", 200);
    });
  });
  after(async () => {
    await app.close();
  });
});
