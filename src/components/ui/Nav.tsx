import { useUser } from '@auth0/nextjs-auth0';
import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import Switch from './Switch';
import { useDarkMode } from '@/hooks/theme';
import { useRouter } from 'next/router';
import ReactDOM from 'react-dom';

export const Nav: React.FC = () => {
    const { user } = useUser();
    const { theme, toggle } = useDarkMode();
    const router = useRouter();
    let [rendered, setRendered] = useState(false);
    useEffect(() => {
        setRendered(true)
    }, [setRendered])

    return (
        <>
        <nav className={`normal-nav ${router.pathname === '/' ? 'home-nav' : ''}`}>
            <div className="nav-message">
                <Link href="/">Home</Link>
            </div>
            <div className="nav-items">
                { user && (
                <>
                    <div className="nav-item">
                        <Link href="/dashboard">Dashboard</Link>
                    </div>
                    {/* <div className="nav-item">
                        <Link href="/settings">Settings</Link>
                    </div> */}
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
        { rendered && ReactDOM.createPortal((
            <div className={`theme-switch-container ${router.pathname === '/' ? 'home' : ''}`} style={{
                left: router.pathname.match(/\/projects/g) ? '300px' : ''
            }}>
                <p>theme</p>
                <Switch 
                    handleToggle={() => toggle()} 
                    isOn={Boolean(theme === 'dark')} 
                    onColor="var(--primary)"
                />
            </div>
        ), document.body) 
        }
        </>
    )
}