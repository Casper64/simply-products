
interface User {
    id: number;
    username: string;
}

export const useUser = () => useState<User | null>(() => null);

/**
 * Automatically logs in the user if the cookies are set
 */
export async function autoLogin() {
    const user = useUser();

    const { authorized, data } = await $fetch('/api/auth', {
        method: 'POST',
        headers: useRequestHeaders(['cookie']),
    });
    if (authorized) {
        user.value = data;
    }
}

/**
 * Logs the user out and removes all cookies
 */
export function logout() {
    const user = useUser();
    user.value = null;
    // Clearing all the cookies
    for (const cookie of document.cookie.split(';')) {
        const [name, value] = cookie.split('=');
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
}