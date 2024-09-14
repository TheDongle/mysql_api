import { FastifyPluginAsync, type FastifyReply, type FastifyRequest } from "fastify";
import fastifyPlugin from "fastify-plugin";

declare global {
  interface AuthHeader {
    "x-api-key": string;
  }
}

const authSchema = {
  $id: "auth",
  type: "object",
  properties: {
    "x-api-key": { type: "string" },
  },
};

async function auth(request: FastifyRequest, reply: FastifyReply) {
  const requestKey = request.headers["x-api-key"];
  if (request.method !== "GET" && request.method !== "HEAD" && requestKey !== process.env.APIKEY) {
    return reply.code(401).send({ error: "Unauthorized" });
  }
}

const AuthPlugin: FastifyPluginAsync<{}> = async fastify => {
  fastify.addSchema(authSchema);
  fastify.addHook("preHandler", async (request, reply) => await auth(request, reply));
};

export default fastifyPlugin(AuthPlugin, "4.28.1");
