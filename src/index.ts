import { build } from "./server.js";

const server = build({ logger: process.env.NODE_ENV === "development" });

server.listen(
  { port: 3000, host: process.env.host },
  function (err, address) {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
  },
);
