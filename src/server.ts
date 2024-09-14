import fastify from "fastify";
import AuthPlugin from "./plugins/auth.js";
import SelectRoute from "./routes/select.js";
import TestRoute from "./routes/ping.js";
import InsertRoute from "./routes/insert.js";
import fastifyMysql, { MySQLPromisePool } from "@fastify/mysql";
import DeleteRoute from "./routes/delete.js";

declare module "fastify" {
  interface FastifyInstance {
    mysql: MySQLPromisePool;
  }
}

function build(fastifyOptions = {}) {
  const app = fastify(fastifyOptions);
  app.register(AuthPlugin);
  app.register(fastifyMysql, {
    promise: true,
    connectionString: process.env.MYSQL_URL,
  });
  app.register(SelectRoute);
  app.register(InsertRoute);
  app.register(DeleteRoute);

  app.register(TestRoute, { prefix: "/ping" });

  return app;
}

export { build };
