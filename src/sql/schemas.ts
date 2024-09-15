type TableName = "Sudokus";
type ColumnName = "SudokuID" | "Board" | "TestColumn" | "Difficulty";
type ColumnType = number | string;

const tableNameSchema = {
  type: "string",
  enum: <TableName[]>["Sudokus"],
};

const columnSchema = {
  $id: "columnSchema",
  type: "array",
  items: {
    type: "object",
    properties: {
      "COUNT(*)": {
        type: "number",
      },
      SudokuID: {
        type: "number",
      },
      Board: {
        type: "string",
      },
      TestColumn: {
        type: "number",
      },
      Difficulty: {
        type: "string",
        enum: ["e", "n", "h"],
      },
    },
  },
};

const columnNameSchema = {
  type: "string",
  enum: Object.keys(columnSchema.items.properties).filter(prop => prop !== "COUNT(*)"),
};

const columnValueSchema = {
  anyOf: [
    { type: "string" },
    { type: "number" },
    { type: "array", items: { anyOf: [{ type: "string" }, { type: "number" }] } },
  ],
};

export { columnSchema, columnNameSchema, tableNameSchema, columnValueSchema };
export type { TableName, ColumnName, ColumnType };
