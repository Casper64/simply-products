

export default defineNuxtRouteMiddleware(async(to, from) => {
    const user = useUser();
    // The user is defined so we don't have to do anything
    if (user.value !== null) return
    
    // The user is not yet defined so we need to check if the user is logged in
    const { authorized, data } = await $fetch('/api/auth', {
        method: 'POST',
        headers: useRequestHeaders(['cookie']),
    });
    if (!authorized) {
        return navigateTo("/auth/login");
    }
    else {
        user.value = data;
    }
});
