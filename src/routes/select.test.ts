import { expect } from "chai";
import { build } from "../server.js";
import type { FastifyInstance, InjectOptions } from "fastify";
import mysql, { Pool } from "mysql2/promise";

describe("Select Route", () => {
  const request: InjectOptions = {
    method: "GET",
    url: "/",
  };
  let app: FastifyInstance;
  let connection: Pool;
  before(async () => {
    app = build();
    connection = mysql.createPool({ uri: process.env.MYSQL_URL });
    await connection.execute({ sql: `INSERT INTO Sudokus (Board) VALUES (?)`, values: ["999"] });
    await app.ready();
  });
  describe("Request Validation", () => {
    it("does not require API KEY", async () => {
      const withKey = await app.inject({
        url: "/",
        method: "GET",
        query: {
          select: "*",
          from: "Sudokus",
        },
        headers: {
          "x-api-key": process.env.APIKEY,
        },
      });
      const withoutKey = await app.inject({
        url: "/",
        method: "GET",
        query: {
          select: "*",
          from: "Sudokus",
        },
      });
      expect(withKey["statusCode"]).to.equal(200);
      expect(withoutKey["statusCode"]).to.equal(200);
    });
    it("rejects request with no params", async () => {
      const response = await app.inject({ ...request });
      expect(response.statusCode).to.equal(400);
    });
    it("rejects request with unknown table", async () => {
      const response = await app.inject({
        query: {
          select: "*",
          from: "FlimFlam",
        },
        ...request,
      });
      expect(response.statusCode).to.equal(400);
    });
    it("rejects request with unknown Column", async () => {
      const response = await app.inject({
        query: {
          select: "Unknown",
          from: "Sudokus",
        },
        ...request,
      });
      expect(response.statusCode).to.equal(400);
    });
  });
  describe("Valid Requests yeild a good response", () => {
    it("Allows request SELECT * FROM table", async () => {
      const response = await app.inject({
        query: {
          select: "*",
          from: "Sudokus",
        },
        ...request,
      });
      expect(response).to.have.property("statusCode", 200);
      const { data } = JSON.parse(response.body);
      expect(data).to.be.not.undefined;
      expect(data[0]).to.have.property("SudokuID");
      expect(data[0]["SudokuID"]).to.be.a("number");
      expect(data[0]).to.have.property("Board");
      expect(data[0]["Board"]).to.be.a("string");
    });
    it("Allows request SELECT [column] FROM table", async () => {
      const response = await app.inject({
        query: {
          select: ["Board"],
          from: "Sudokus",
        },
        ...request,
      });
      expect(response).to.have.property("statusCode", 200);
      const { data } = JSON.parse(response.body);
      expect(data).to.be.not.undefined;
      expect(data[0]).to.have.property("Board");
      expect(data[0]).to.not.have.property("SudokuID");
    });
    it("Allows request SELECT [column1, column2] FROM table", async () => {
      const response = await app.inject({
        query: {
          select: ["Board", "SudokuID"],
          from: "Sudokus",
        },
        ...request,
      });
      expect(response).to.have.property("statusCode", 200);
      const { data } = JSON.parse(response.body);
      expect(data).to.be.not.undefined;
      expect(data[0]).to.have.property("Board");
      expect(data[0]).to.have.property("SudokuID");
    });
    it("Allows request COUNT(*) FROM table", async () => {
      const response = await app.inject({
        query: {
          select: "COUNT(*)",
          from: "Sudokus",
        },
        ...request,
      });
      expect(response).to.have.property("statusCode", 200);
      const { data } = JSON.parse(response.body);
      expect(data).to.be.not.undefined;
      expect(data[0]).to.have.property("COUNT(*)");
    });
  });

  after(async () => {
    await app.close();
    await connection.end();
  });
});
