import { selectFormat } from "./select.js";
import { expect } from "chai";

describe("Select Query Format", () => {
  it("Formats Query for SELECT *", () => {
    expect(selectFormat({ select: "*", from: "Sudokus" })).to.equal("SELECT * FROM Sudokus");
  });
  it("LIMIT can be added", () => {
    expect(selectFormat({ select: "*", from: "Sudokus", limit: 99 })).to.equal(
      "SELECT * FROM Sudokus LIMIT 99",
    );
  });
  it("Formats Query for SELECT single Column", () => {
    expect(selectFormat({ select: "Board", from: "Sudokus" })).to.equal(
      "SELECT Board FROM Sudokus",
    );
  });
  it("Formats Query for SELECT two Columns", () => {
    expect(selectFormat({ select: ["Board", "SudokuID"], from: "Sudokus" })).to.equal(
      "SELECT Board,SudokuID FROM Sudokus",
    );
  });
  it("can format with WHERE (column) IN (single value)", () => {
    expect(
      selectFormat({ select: "SudokuID", from: "Sudokus", where: "SudokuID", in: [1] }),
    ).to.equal("SELECT SudokuID FROM Sudokus WHERE SudokuID IN (?)");
  });
  it("can format with WHERE (column) IN (multiple values)", () => {
    expect(
      selectFormat({ select: "TestColumn", from: "Sudokus", where: "SudokuID", in: [1, 2, 3] }),
    ).to.equal("SELECT TestColumn FROM Sudokus WHERE SudokuID IN (?,?,?)");
  });
  it("can include NOT IN", () => {
    expect(
      selectFormat({
        select: "TestColumn",
        from: "Sudokus",
        where: "SudokuID",
        not: true,
        in: [1, 2, 3],
      }),
    ).to.equal("SELECT TestColumn FROM Sudokus WHERE SudokuID NOT IN (?,?,?)");
  });
  it("Allows SELECT COUNT(*)", () => {
    expect(
      selectFormat({
        select: "COUNT(*)",
        from: "Sudokus",
      }),
    ).to.equal("SELECT COUNT(*) FROM Sudokus");
  });
});
