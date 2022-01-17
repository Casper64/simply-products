import store from '@/store';
import { useEffect, useState } from 'react'

export const useDarkMode = () => {
    let [theme, setTheme] = useState('light');

    const toggle = (val?: string) => {
        let t = val || theme === 'light' ? 'dark' : 'light';
        setTheme(t);
        window.localStorage.setItem("theme", t);
        store.setDarkMode(Boolean(t === 'dark'));
        console.log(t, theme)
    }

    const watchDarkModeDevice = (event: MediaQueryListEvent) => {
        if (event.matches) {
            toggle('dark')
        }
        else {
            toggle('light');
        }
    }

    useEffect(() => {
        const localTheme = window.localStorage.getItem("theme");
        
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            toggle('dark');
            store.setDarkMode(true);
        }
        else if (localTheme) {
            setTheme(localTheme);
            store.setDarkMode(localTheme === 'dark');
        } 
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', watchDarkModeDevice);
        
        return () => {
            window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', watchDarkModeDevice);
        }
    }, []);

    return { theme, toggle }
}