import { getConnection } from "~~/server/mysql";

export default defineEventHandler(async (event) => {
    const { email, username, password } = await useBody(event);

    const connection = await getConnection();

    const [rows, fields] = await connection.execute(
        "INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
        [email, username, password]
    )

    console.log(rows, fields);

    return {
        rows,
        fields
    }
})