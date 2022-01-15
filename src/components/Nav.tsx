import { useUser } from '@auth0/nextjs-auth0';
import React from 'react';
import Link from 'next/link'

export const Nav: React.FC = () => {
    const { user } = useUser();
    return (
        <nav className="normal-nav">
            <div className="nav-message">
                <Link href="/">Home</Link>
            </div>
           
            <div className="nav-items">
                { user && (
                <>
                    <div className="nav-item">
                        <Link href="/dashboard">Dashboard</Link>
                    </div>
                    <div className="nav-item">
                        <Link href="/settings">Settings</Link>
                    </div>
                    <div className="nav-item">
                        <Link href="/api/auth/logout">Log out</Link>
                    </div>
                </>
                ) }
                { !user && (
                <>
                    <div className="nav-item">
                        <Link href="/api/auth/login?returnTo=%2Fdashboard">Log in</Link>
                    </div>
                </>
                )}
            </div>
        </nav>
    )
}