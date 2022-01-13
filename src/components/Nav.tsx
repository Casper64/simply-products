import { useUser } from '@auth0/nextjs-auth0';
import React from 'react';
import Link from 'next/link'

export const Nav: React.FC = () => {
    const { user } = useUser();
    return (
        <nav className="normal-nav">
            <div className="nav-message">
                <Link href="/">
                    <a>Welcome { user?.nickname }</a>
                </Link>
            </div>
           
            <div className="nav-items">
                <div className="nav-item">
                    <Link href="/">Home</Link>
                </div>
                <div className="nav-item">
                    <Link href="/settings">Settings</Link>
                </div>
            </div>
        </nav>
    )
}