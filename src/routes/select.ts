import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { prepareSelect, type SelectOptions } from "../sql/select.js";
import type { ResultSetHeader } from "mysql2/promise";
import {
  columnNameSchema,
  columnSchema,
  columnValueSchema,
  tableNameSchema,
} from "../sql/schemas.js";

const selectQuery = {
  $id: "selectQuery",
  type: "object",
  required: ["from", "select"],
  properties: {
    from: tableNameSchema,
    select: {
      anyOf: [
        columnNameSchema,
        { type: "string", enum: ["*", "COUNT(*)"] },
        {
          type: "array",
          items: columnNameSchema,
        },
      ],
    },
    not: {
      type: "boolean",
    },
    where: columnNameSchema,
    in: columnValueSchema,
  },
};

const selectReply = {
  $id: "selectReply",
  type: "object",
  properties: {
    data: columnSchema,
  },
};

type SelectReply = Reply<ResultSetHeader[]>;

const schema = {
  querystring: { $ref: "selectQuery" },
  response: {
    200: { $ref: "selectReply" },
  },
};

const SelectRoute: FastifyPluginAsync<{}> = async (fastify: FastifyInstance) => {
  fastify
    .addSchema(selectQuery)
    .addSchema(selectReply)
    .get<{
      Querystring: SelectOptions;
      Reply: SelectReply;
      Header: AuthHeader;
    }>("/", { schema }, async (request, reply) => {
      try {
        const connection = await fastify.mysql.getConnection();
        const [data] = await connection.execute<ResultSetHeader[]>(
          prepareSelect(request.query),
          request.query.in,
        );
        connection.release();
        reply.code(200).send({ data });
      } catch (err) {
        reply.code(500).send({ error: `SQL Error ${err}` });
      }
    });
};

export default SelectRoute;
