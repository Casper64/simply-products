import React from 'react'
import { Nav } from '@/components/Nav'

export const Layout: React.FC = ({ children }) => {
    return (
        <div className="app layout-default" data-theme="dark">
            <Nav></Nav>
            { children }
        </div>
    )
}

export default Layout