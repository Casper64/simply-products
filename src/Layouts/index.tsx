import React from 'react'
import { Nav } from '@/components/Nav'
import { useDarkMode } from '@/hooks/theme'
import { observer } from 'mobx-react';
import store from '@/store';

export const Layout: React.FC = observer(({ children }) => {
    const theme = store.darkMode ? 'dark' : 'light';
    return (
        <div className="app layout-default" data-theme={theme}>
            <Nav></Nav>
            { children }
        </div>
    )
})

export default Layout