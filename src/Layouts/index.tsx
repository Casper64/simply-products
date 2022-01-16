import React, { useEffect } from 'react'
import { Nav } from '@/components/ui/Nav'
import { observer } from 'mobx-react';
import store from '@/store';

export const Layout: React.FC = observer(({ children }) => {
    const theme = store.darkMode ? 'dark' : 'light';

    useEffect(() => {
        document.body.dataset.theme = theme;
    }, [theme])
    return (
        <div className="app layout-default">
            <Nav></Nav>
            { children }
        </div>
    )
})

export default Layout