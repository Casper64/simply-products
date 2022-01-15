import store from '@/store';
import { useEffect, useState } from 'react'

export const useDarkMode = () => {
    let [theme, setTheme] = useState('light');

    const toggle = () => {
        let t = theme === 'light' ? 'dark' : 'light';
        setTheme(t);
        window.localStorage.setItem("theme", t);
        store.setDarkMode(Boolean(t === 'dark'));
        console.log(t, theme)
    }

    useEffect(() => {
        const localTheme = window.localStorage.getItem("theme");
        if (localTheme) {
            setTheme(localTheme);
        } 
        store.setDarkMode(Boolean(localTheme === 'dark'));
    }, []);

    return { theme, toggle }
}