import type { TableName, ColumnName, ColumnType } from "./schemas.js";
import { arrayWrap, prepareQuery } from "../utils.js";

interface InsertOptions {
  insertInto: TableName;
  columns: ColumnName | ColumnName[];
  values: ColumnType | ColumnType[];
}

function insertFormat({ insertInto, columns: col, values: val }: InsertOptions): string {
  const [columns, values] = [arrayWrap(col), arrayWrap(val)];
  const firstRow = `(?${",?".repeat(columns.length - 1)})`;
  const numberOfRows = Math.floor(values.length / columns.length);
  const allRows = `${firstRow}${`,${firstRow}`.repeat(numberOfRows - 1)}`;
  return `INSERT INTO ${insertInto} (${columns}) VALUES ${allRows}`;
}

function prepareInsert(options: InsertOptions) {
  return prepareQuery(insertFormat(options), options.values);
}

export { insertFormat, prepareInsert };
export type { InsertOptions };
