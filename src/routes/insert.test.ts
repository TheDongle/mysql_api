import { expect } from "chai";
import { build } from "../server.js";
import type { FastifyInstance, InjectOptions } from "fastify";
import mysql, { Pool } from "mysql2/promise";
import { env } from "node:process";

describe("Insert Route", () => {
  let app: FastifyInstance;
  let connection: Pool;
  const request: InjectOptions = { headers: { "x-api-key": env.APIKEY }, url: "/", method: "post" };
  before(async () => {
    app = build();
    connection = mysql.createPool({ uri: process.env.MYSQL_URL });
    await connection.query(`INSERT INTO Sudokus (Board) Values (111222333)`);
    await app.ready();
  });
  describe("Request Validation", () => {
    it("rejects missing API KEY", async () => {
      const response = await app.inject({
        url: "/",
        method: "POST",
        body: {
          insertInto: "Sudokus",
          columns: "Board",
          values: "d",
        },
      });
      expect(response["statusCode"]).to.equal(401);
    });
    it("rejects when body is missing", async () => {
      const response = await app.inject({
        ...request,
      });
      expect(response["statusCode"]).to.equal(400);
    });
    it("rejects request with no insertInto", async () => {
      const response = await app.inject({
        ...request,
        body: {
          columns: "Board",
          values: "000999",
        },
      });
      expect(response["statusCode"]).to.equal(400);
    });
    it("rejects when columns are missing", async () => {
      const response = await app.inject({
        ...request,
        body: {
          insertInto: "Sudokus",
          values: "000999",
        },
      });
      expect(response["statusCode"]).to.equal(400);
    });
    it("rejects when values are missing", async () => {
      const response = await app.inject({
        ...request,
        body: {
          insertInto: "Sudokus",
          columns: "Board",
        },
      });
      expect(response["statusCode"]).to.equal(400);
    });

    it("rejects invalid insertInto name", async () => {
      const response = await app.inject({
        ...request,
        body: {
          insertInto: "a",
          columns: "Board",
          values: "1",
        },
      });
      expect(response["statusCode"]).to.equal(400);
    });
    it("rejects invalid column name", async () => {
      const response = await app.inject({
        ...request,
        body: {
          insertInto: "Sudokus",
          columns: "invalid",
          values: "1",
        },
      });
      expect(response["statusCode"]).to.equal(400);
    });
    it("rejects invalid value type", async () => {
      const response = await app.inject({
        ...request,
        body: {
          insertInto: "Sudokus",
          columns: "Board",
          values: [{ it: "obj" }],
        },
      });
      expect(response["statusCode"]).to.equal(400);
    });
  });

  describe("Single row, Single column", () => {
    let response: any;
    before(async () => {
      response = await app.inject({
        ...request,
        body: {
          insertInto: "Sudokus",
          columns: "Board",
          values: "123456789",
        },
      });
    });
    it("Returns 200", async () => {
      expect(response).to.have.property("statusCode", 200);
    });
    it("Returns Data", async () => {
      expect(JSON.parse(response.body)).to.have.property("data");
    });
    it("Includes InsertID", async () => {
      expect(JSON.parse(response.body)["data"]).to.have.property("insertId");
    });
  });
  describe("Multiple rows, single column", () => {
    let response: any;
    before(async () => {
      response = await app.inject({
        ...request,
        body: {
          insertInto: "Sudokus",
          columns: "Board",
          values: ["bn", "sd", "er", "gh", "ss"],
        },
      });
    });
    it("Accepts 5 inserts", async () => {
      expect(response).to.have.property("statusCode", 200);
    });
  });
  describe("Multiple rows, Multiple columns", () => {
    let response: any;
    before(async () => {
      response = await app.inject({
        ...request,
        body: {
          insertInto: "Sudokus",
          columns: ["Board", "TestColumn"],
          values: ["bn", 1, "sd", 2],
        },
      });
    });
    it("Accepts 2 inserts with 2 columns", async () => {
      expect(response).to.have.property("statusCode", 200);
    });
  });

  after(async () => {
    await app.close();
    await connection.end();
  });
});
