import { checkLoginCookies, removeLoginCookies, setLoginCookies, verify_password } from "~~/server/auth";
import { getConnection } from "~~/server/mysql";
import { getUsersDataById } from "~~/server/user";
import { sendError } from 'h3'

import type { RowDataPacket, FieldPacket } from "mysql2";

export default defineEventHandler(async (event) => {
    const { email, password, remember } = await useBody(event);

    
    // First check cookies
    const user_id = await checkLoginCookies(event);
    if (user_id !== false) {
        return await getUsersDataById(event, user_id)
    }
    
    const connection = await getConnection();

    // Hash the given password and verify it with the hashed password in the database
    try {
        var [rows, fields] = await connection.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        ) as [RowDataPacket[], FieldPacket[]];
    }
    catch (error) {
        // SQL error
        sendError(event, createError({
            statusCode: 400,
            statusMessage: error
        }))
    }
    // The email wasn't found so the user doesn't exist
    if (rows.length != 1) {
        sendError(event, createError({
            statusCode: 400,
            statusMessage: "User not found"
        }))
    }

    const valid = await verify_password(password, rows[0].password);

    if (valid) {
        // The user has been authenticated
        const { id, username } = rows[0];

        // Set cookies for login if the users checked the "remember me" checkbox
        // Else remove the cookies
        if (remember) {
            await setLoginCookies(event, id);
        }
        else {
            removeLoginCookies(event);
            await setLoginCookies(event, id, true);
        }

        // Return user data
        return { 
            data: {
                id,
                username
            },
        }
    }
    else {
        // The password is incorrect
        sendError(event, createError({
            statusCode: 400,
            statusMessage: "Password incorrect"
        }));
    }
})