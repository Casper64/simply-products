import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { getConnection } from "~~/server/mysql";
import { sendError } from 'h3';

import type { CompatibilityEvent } from 'h3';
import type { OkPacket, FieldPacket, RowDataPacket } from "mysql2";

// Hashing and verifying done according to OWASP recommendations from (july 2022)
// https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

const hashingConfig: Partial<argon2.Options & { raw?: false }> = {
    parallelism: 1,
    memoryCost: 64000, // 64 mb
    timeCost: 3, // number of iterations
}

/**
 * Hash a password
 * @param password - plaintext password
 * @returns the hashsed password
 */
export async function hash_password(password: string) {
    let salt = crypto.randomBytes(16);
    return await argon2.hash(password, {
        ...hashingConfig,
        salt
    })
}

/**
 * Verify a password based on its hash
 * @param password - plaintext password 
 * @param hash - hashed password 
 * @returns whether the password is correct
 */
export async function verify_password(password: string, hash: string) {
    return await argon2.verify(hash, password);
}

/**
 * Returns a random hex string based on the length
 * @param length the length of the string 
 * @returns the random hex string
 */
export function random_string(length: number = 16) {
    return crypto.randomBytes(length).toString('hex');
}

/**
 * Sets the login cookies for the user
 * @param event The Event of the route's EventHandler
 * @param id The users id
 * @param session_only Whether the cookies should be session only default is false
 */
export async function setLoginCookies(event: CompatibilityEvent, id: number, session_only = false) {
    const connection = await getConnection();

    // Create cookie tokens
    const token = random_string();
    const private_password = random_string(32);
    const private_hash = await hash_password(private_password);
    // Expiration date set to 30 days
    // One liner from: https://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime
    let expire_time = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    const expires = expire_time.toISOString().slice(0, 19).replace('T', ' ');
    
    try {

        // ON DUPLICATE KEY UPDATE token=VALUES(token), private_hash=VALUES(private_hash), expires=VALUES(expires)
        await connection.execute(
            `INSERT INTO token_auth (user_id, token, private_hash, expires) VALUES (?, ?, ?, ?)`,
            [id, token, private_hash, expires]
        );
    }
    catch (error) {
        // Internal error happened :(
        sendError(event, createError({
            statusCode: 500,
            statusMessage: error
        }))
    }

    if (session_only === true) {
        // Set the session cookies on the users side
        // If we set no expiration date the cookie will automatically become a session cookie
        // And we don't need consent for session cookies according to GDPR because they are first party only
        setCookie(event, "token", token, {
            path: '/'
        });
        setCookie(event, "selector", private_password, {
            path: '/'
        });
    }
    else {
         // Set the cookies on the users side
         setCookie(event, "token", token, {
            expires: expire_time, path: '/'
        });
        setCookie(event, "selector", private_password, {
            expires: expire_time, path: '/'
        });
    }
}

/**
 * Remove's all the cookies associated to login from the user
 * @param event The Event of the route's EventHandler
 */
export function removeLoginCookies(event: CompatibilityEvent) {
    deleteCookie(event, "token");
    deleteCookie(event, "selector");
}

/**
 * Checks if the user is logged in
 * @param event The Event of the route's EventHandler
 */
export async function checkLoginCookies(event: CompatibilityEvent): Promise<false|number> {
    const { token, selector } = useCookies(event);
    if (!token || !selector) return false;

    const connection = await getConnection();
    try {
        var [rows, fields] = await connection.execute(
            `SELECT * FROM token_auth WHERE token=?`,
            [token]
        ) as [RowDataPacket[], FieldPacket[]];
    }
    catch (error) {
        // SQL Error
        sendError(event, createError({
            statusCode: 400,
            statusMessage: error
        }))
        return false
    }

    if (rows.length == 0) return false;
    // A token exists for this user
    const { token_id, user_id, private_hash, expires } = rows[0];
    let valid = await verify_password(selector, private_hash);
    if (!valid) return false;

    let expire_date =  Number(expires);
    if (Date.now() > expire_date) {
        // Token expired
        try {
            await connection.execute(
                `DELETE FROM token_auth WHERE token_id=?`,
                [token_id]
            );
        }
        catch (error) {
            // SQL Error
            sendError(event, createError({
                statusCode: 400,
                statusMessage: error
            }))
        }
        return false;
    }

    // The selector is verified and the token is still valid
    return user_id;
}

/**
 * Get the auth tokens associated with this user
 * @param event The Event of the route's EventHandler
 * @param user_id The user's id
 * @returns 
 */
export async function getAuthTokens(event: CompatibilityEvent, user_id: number) {
    const connection = await getConnection();
    try {
        var [rows, fields] = await connection.execute(
            `SELECT * FROM token_auth WHERE user_id=?`,
            [user_id]
        ) as [RowDataPacket[], FieldPacket[]];
    }
    catch (error) {
        // SQL Error
        return sendError(event, createError({
            statusCode: 400,
            statusMessage: error
        }))
    }

    if (rows.length == 0) {
        return sendError(event, createError({
            statusCode: 400,
            statusMessage: "No auth token found for this user"
        }))
    }

    return rows;
}