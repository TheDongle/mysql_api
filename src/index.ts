import { build } from "./server.js";
import { env } from "node:process";

const server = build(env.NODE_ENV === "development" ? "development" : "production", {
  logger: true,
});

server.listen({ port: parseInt(`${env.PORT}`), host: `${env.HOST}` }, function (err, address) {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
