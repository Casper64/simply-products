import { hash_password, removeLoginCookies, setLoginCookies } from "~~/server/auth";
import { getConnection } from "~~/server/mysql";
import type { OkPacket, FieldPacket } from "mysql2";
import { sendError } from 'h3';

export default defineEventHandler(async (event) => {
    const { email, username, password, remember } = await useBody(event);

    const connection = await getConnection();

    const hash = await hash_password(password);

    try {
        var [rows, fields] = await connection.execute(
            "INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
            [email, username, hash]
        ) as [OkPacket, FieldPacket[]];
    }
    catch (error) {
        if (error.sqlMessage.match(/Duplicate entry/g)) {
            return sendError(event, createError({
                statusCode: 400,
                statusMessage: "Email already exists"
            }));
        }

        // SQL Error
        return sendError(event, createError({
            statusCode: 400,
            statusMessage: error
        }))
    }
    
    const id = rows.insertId;

    // Set cookies for login if the users checked the "remember me" checkbox
    // Else remove the cookies
    if (remember) {
        await setLoginCookies(event, id);
    }
    else {
        removeLoginCookies(event);
        await setLoginCookies(event, id, true);
    }

    return {
        id
    }
})