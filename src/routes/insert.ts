import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import type { ResultSetHeader } from "mysql2/promise";
import { prepareInsert, type InsertOptions } from "../sql/insert.js";
import { columnNameSchema, columnValueSchema, tableNameSchema } from "../sql/schemas.js";

const insertBody = {
  $id: "insertBody",
  type: "object",
  required: ["insertInto", "columns", "values"],
  properties: {
    insertInto: tableNameSchema,
    columns: {
      anyOf: [
        columnNameSchema,
        {
          type: "array",
          items: columnNameSchema,
        },
      ],
    },
    values: columnValueSchema,
  },
};

type InsertReply = Reply<ResultSetHeader>;

const insertReply = {
  $id: "insertReply",
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        affectedRows: { type: "number" },
        fieldCount: { type: "number" },
        info: { type: "string" },
        insertId: { type: "number" },
      },
    },
  },
};

const schema = {
  body: { $ref: "insertBody" },
  response: {
    200: { $ref: "insertReply" },
  },
  headers: { $ref: "auth#" },
};

const InsertRoute: FastifyPluginAsync<{}> = async (fastify: FastifyInstance) => {
  fastify
    .addSchema(insertBody)
    .addSchema(insertReply)
    .post<{
      Body: InsertOptions;
      Reply: InsertReply;
      Header: AuthHeader;
    }>("/", { schema }, async (request, reply) => {
      try {
        const connection = await fastify.mysql.getConnection();
        const [data] = await connection.execute<ResultSetHeader>(prepareInsert(request.body));
        connection.release();
        reply.code(200).send({ data });
      } catch (err) {
        reply.code(500).send({ error: `SQL Error ${err}` });
      }
    });
};

export default InsertRoute;
