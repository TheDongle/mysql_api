// import { expect } from "chai";
// import { tableNameSchema, columnNameSchema, columnValueSchema, columnSchema } from "./schemas.js";

// const tableList = ["Sudokus"];
// const columnList = ["SudokuID", "Board", "TestColumn"];

// describe("Schemas", () => {
//   it("Provides schema for tableNames", () => {
//     expect(tableNameSchema).to.have.property("type", "string");
//     expect(tableNameSchema.enum).to.deep.equal(tableList);
//   });
//   it("Provides schema for ColumnNames", () => {
//     expect(columnNameSchema).to.have.property("type", "string");
//     expect(columnNameSchema.enum).to.deep.equal(columnList);
//   });
//   it("Provides schema for ColumnValues", () => {
//     expect(columnValueSchema).to.have.property("anyOf");
//     columnValueSchema.anyOf.forEach(ele => expect(ele).to.have.property("type"));
//   });
//   it("provides schema for Columns", () => {
//     ["$id", "type", "items"].forEach(property => expect(columnSchema).to.have.property(property));
//   });
// });
