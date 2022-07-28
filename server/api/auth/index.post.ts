import { checkLoginCookies } from "~~/server/auth";
import { getUsersDataById } from "~~/server/user";


export default defineEventHandler(async (event) => {
    const user_id = await checkLoginCookies(event);
    if (user_id !== false) {
        var {data} = await getUsersDataById(event, user_id);
        return {
            authorized: true,
            data
        }
    }
    else {
        return {
            authorized: false
        }
    }
});