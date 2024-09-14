import mysql from "mysql2/promise";
async function mochaGlobalTeardown() {
    if (process.env.NODE_ENV === "development") {
        const connection = mysql.createPool({
            uri: process.env.MYSQL_URL
        });
        await connection.query(`DELETE FROM Sudokus`);
        const [result] = await connection.query(`SELECT COUNT(*) FROM Sudokus`);
        console.log(result);
        await connection.end();
    }
}
export { mochaGlobalTeardown };
