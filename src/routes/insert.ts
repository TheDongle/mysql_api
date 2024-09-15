import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import type { ResultSetHeader } from "mysql2/promise";
import { prepareInsert, type InsertOptions } from "../sql/insert.js";
import { columnNameSchema, columnValueSchema, tableNameSchema } from "../sql/schemas.js";
import { arrayWrap } from "../utils.js";

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

function checkDifficulty(
  columns: InsertOptions["columns"],
  values: InsertOptions["values"],
): boolean {
  if (!Array.isArray(columns)) return true;
  const ind = columns.findIndex(ele => ele === "Difficulty");
  if (ind === -1) return true;
  const vals = arrayWrap(values);
  for (let i = ind; i < vals.length; i += ind + 1) {
    if (!["e", "n", "h"].some(ele => ele === vals[i])) return false;
  }
  return true;
}

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
        if (checkDifficulty(request.body.columns, request.body.values) === true) {
          const connection = await fastify.mysql.getConnection();
          const [data] = await connection.execute<ResultSetHeader>(prepareInsert(request.body));
          connection.release();
          reply.code(200).send({ data });
        } else {
          reply.code(400).send({ error: "Unrecognised value provided for Difficulty column" });
        }
      } catch (err) {
        reply.code(500).send({ error: `SQL Error ${err}` });
      }
    });
};

export default InsertRoute;
