import type { ColumnName, TableName, ColumnType } from "./schemas.js";
import type { ResultSetHeader } from "mysql2/promise";
import { arrayWrap } from "../utils.js";
import { prepareQuery } from "../utils.js";

interface SelectOptions {
  from: TableName;
  select: ColumnName[] | ColumnName | "*" | "COUNT(*)";
  where?: ColumnName;
  in?: ColumnType[] | ColumnType;
  not?: Boolean;
  limit?: number;
}

const limitString = (limit: number): string => (limit !== Infinity ? ` LIMIT ${limit}` : "");

function selectFormat({
  select,
  from,
  where,
  in: _in,
  not = false,
  limit = Infinity,
}: SelectOptions) {
  if (select === "COUNT(*)" || where === undefined || _in === undefined) {
    return `SELECT ${select} FROM ${from}${limitString(limit)}`;
  }
  return `SELECT ${select} FROM ${from} WHERE ${where}${not ? " NOT" : ""} IN (?${",?".repeat(
    arrayWrap(_in).length - 1,
  )})${limitString(limit)}`;
}

function prepareSelect(options: SelectOptions) {
  return prepareQuery(selectFormat(options), options.in);
}

export { selectFormat, prepareSelect };
export type { SelectOptions };
