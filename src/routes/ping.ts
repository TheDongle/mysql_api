import type { FastifyInstance } from "fastify";
import { createError } from "@fastify/error";

const pingError = createError("500", "Ping failed");

async function pingDB(fastify: FastifyInstance) {
  try {
    const connection = await fastify.mysql.getConnection();
    connection.release();
    return true;
  } catch (err) {
    return false;
  }
}

async function route(fastify: FastifyInstance) {
  fastify
    .get("/", async (request, reply) => {
      return (await pingDB(fastify)) ? request.query : pingError;
    })
    .post("/", async (request, reply) => {
      return (await pingDB(fastify)) ? request.body : pingError;
    })
    .head("/", async (request, reply) => {
      return (await pingDB(fastify)) ? request.headers : pingError;
    })
    .patch("/", async (request, reply) => {
      return (await pingDB(fastify)) ? request.body : pingError;
    })
    .delete("/", async (request, reply) => {
      return (await pingDB(fastify)) ? request.body : pingError;
    });
}

export default route;
