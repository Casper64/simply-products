import { getConnection } from "./mysql";
import type { RowDataPacket, FieldPacket } from "mysql2";
import { sendError } from "h3";

import type { CompatibilityEvent} from "h3";

/**
 * Get the user by id
 * @param event The event that was sent to the server
 * @param id the users id
 * @returns the user data if found
 */
export async function getUserById(event: CompatibilityEvent, id: number) {
    const connection = await getConnection();

    try {
        var [rows, fields] = await connection.execute(
            `SELECT * FROM users WHERE id = ?`,
            [id]
        ) as [RowDataPacket[], FieldPacket[]];
    }
    catch (error) {
        // SQL Error
        sendError(event, createError({
            statusCode: 400,
            statusMessage: error
        }))
    }

    if (rows.length != 1) {
        // User doesn't exist
        sendError(event, createError({
            statusCode: 400,
            statusMessage: "User not found"
        }))
    }

    // The user has been authenticated
    return rows[0];
}

/**
 * Get the user by id and returns the only data neccesary for the user
 * @param event The event that was sent to the server
 * @param id the users id
 * @returns the user data if found
 */
export async function getUsersDataById(event: CompatibilityEvent, id: number) {
    const { username } = await getUserById(event, id);
    return {
        data: {
            id,
            username
        }
    }
}