import { describe } from "node:test";
import { insertFormat } from "./insert.js";
import { expect } from "chai";

describe("InsertFormat query strings", () => {
  it("returns string for 1 rows, and 1 value", () => {
    expect(insertFormat({ insertInto: "Sudokus", columns: ["Board"], values: ["1"] })).to.equal(
      "INSERT INTO Sudokus (Board) VALUES (?)",
    );
  });
  it("returns string for 2 rows, and 1 value each", () => {
    expect(insertFormat({ insertInto: "Sudokus", columns: ["Board"], values: ["1", "2"] })).to.equal(
      "INSERT INTO Sudokus (Board) VALUES (?),(?)",
    );
  });
  it("returns string for 2 rows, and 2 values each", () => {
    expect(
      insertFormat({
        insertInto: "Sudokus",
        columns: ["Board", "TestColumn"],
        values: ["1", "2", 1, 2],
      }),
    ).to.equal("INSERT INTO Sudokus (Board,TestColumn) VALUES (?,?),(?,?)");
  });
  it("returns string for 3 rows, and 1 values each", () => {
    expect(
      insertFormat({
        insertInto: "Sudokus",
        columns: ["TestColumn"],
        values: [1, 2, 3],
      }),
    ).to.equal("INSERT INTO Sudokus (TestColumn) VALUES (?),(?),(?)");
  });
});
