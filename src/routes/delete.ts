import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import type { ResultSetHeader } from "mysql2/promise";
import { prepareDelete, type DeleteOptions } from "../sql/delete.js";
import { columnNameSchema, columnValueSchema, tableNameSchema } from "../sql/schemas.js";

const deleteBody = {
  $id: "deleteBody",
  type: "object",
  required: ["from"],
  properties: {
    from: tableNameSchema,
    where: columnNameSchema,
    in: columnValueSchema,
  },
};

const deleteReply = {
  $id: "deleteReply",
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
  body: { $ref: "deleteBody" },
  response: {
    200: { $ref: "deleteReply" },
  },
  headers: { $ref: "auth#" },
};

const DeleteRoute: FastifyPluginAsync<{}> = async (fastify: FastifyInstance) => {
  fastify
    .addSchema(deleteBody)
    .addSchema(deleteReply)
    .delete<{
      Body: DeleteOptions;
      Reply: Reply<ResultSetHeader>;
      Header: AuthHeader;
    }>("/", { schema }, async (request, reply) => {
      try {
        const connection = await fastify.mysql.getConnection();
        const [data] = await connection.execute<ResultSetHeader>(prepareDelete(request.body));
        connection.release();
        reply.code(200).send({ data });
      } catch (err) {
        reply.code(500).send({ error: `SQL Error ${err}` });
      }
    });
};

export default DeleteRoute;
