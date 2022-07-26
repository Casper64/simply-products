import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import path from 'path'

let connection: undefined | mysql.Connection = undefined; 

export const getConnection = async (): Promise<mysql.Connection> => {
    if (connection === undefined) {
        dotenv.config({ path: path.resolve(process.cwd(),'process.env') })
        connection = await mysql.createConnection({
            host: process.env.HOST,
            user: process.env.MYSQL_USER,
            password: process.env.PASSWD,
            database: process.env.DATABASE
        });
    }
    return connection;
}

