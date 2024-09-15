import { build } from "./server.js";

const server = build({ logger: process.env.NODE_ENV === "development" });

server.listen(
  { port: parseInt(`${process.env.PORT}`), host: process.env.HOST },
  function (err, address) {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
  },
);
