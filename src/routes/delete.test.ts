import { expect } from "chai";
import { build } from "../server.js";
import type { FastifyInstance, InjectOptions } from "fastify";
import mysql, { Pool } from "mysql2/promise";

describe("Delete Route", () => {
  let app: FastifyInstance;
  let connection: Pool;
  const request: InjectOptions = {
    headers: { "x-api-key": process.env.APIKEY },
    url: "/",
    method: "DELETE",
  };
  before(async () => {
    app = build();
    connection = mysql.createPool({ uri: process.env.MYSQL_URL });
    await connection.query(`INSERT INTO Sudokus (Board) Values ('jjj')`);
    await app.ready();
  });

  describe("Invalid Requests", () => {
    it("Rejects missing API Key", async () => {
      const response = await app.inject({
        url: "/",
        method: "DELETE",
        body: {
          from: "Sudokus",
          where: "Board",
          in: "jjj",
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
    it("rejects request with no table value", async () => {
      const response = await app.inject({
        ...request,
        body: {
          where: "Board",
          in: "jjj",
        },
      });
      expect(response["statusCode"]).to.equal(400);
    });
    it("rejects invalid column Name", async () => {
      const response = await app.inject({
        ...request,
        body: {
          insertInto: "Sudokus",
          where: "crab",
          in: "jjj",
        },
      });
      expect(response["statusCode"]).to.equal(400);
    });
    it("rejects invalid column type", async () => {
      const response = await app.inject({
        ...request,
        body: {
          insertInto: "Sudokus",
          where: "Board",
          in: null,
        },
      });
      expect(response["statusCode"]).to.equal(400);
    });

    describe("Valid Request", () => {
      it("Deletes", async () => {
        const response = await app.inject({
          ...request,
          body: {
            from: "Sudokus",
            where: "Board",
            in: "jjj",
          },
        });
        expect(response).to.have.property("statusCode", 200);
        const body = JSON.parse(response.body);
        expect(body).to.have.property("data");
        expect(body["data"]).to.have.property("affectedRows", 1);
      });
    });

    after(async () => {
      await app.close();
      await connection.end();
    });
  });
});
