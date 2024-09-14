import type { TableName, ColumnName, ColumnType } from "./schemas.js";
import { PreparedQuery, prepareQuery, arrayWrap } from "../utils.js";

interface DeleteOptions {
  from: TableName;
  where?: ColumnName;
  in?: ColumnType[];
}

function deleteFormat({ from, where, in: _in }: DeleteOptions) {
  if (where === undefined || _in === undefined) {
    return `DELETE FROM ${from}`;
  }
  return `DELETE FROM ${from} WHERE ${where} IN (?${",?".repeat(arrayWrap(_in).length - 1)})`;
}

function prepareDelete(options: DeleteOptions) {
  return prepareQuery(deleteFormat(options), options.in);
}

export { deleteFormat, prepareDelete };
export type { DeleteOptions };
