import { deleteFormat } from "./delete.js";
import { expect } from "chai";

describe("Delete Format string", () => {
  it("Formats bulk delete string", () => {
    expect(deleteFormat({ from: "Sudokus" })).to.equal("DELETE FROM Sudokus");
  });
  it("Formats delete + where IN", () => {
    expect(deleteFormat({ from: "Sudokus", where: "Board", in: ["a"] })).to.equal(
      "DELETE FROM Sudokus WHERE Board IN (?)",
    );
  });
  it("Formats delete + where IN with multiple IN", () => {
    expect(deleteFormat({ from: "Sudokus", where: "Board", in: ["a", "b", "c"] })).to.equal(
      "DELETE FROM Sudokus WHERE Board IN (?,?,?)",
    );
  });
});
