import React from 'react'

export interface MacWindowProps {
    darkMode?: boolean;
}

const MacWindow: React.FC<MacWindowProps> = ({ children, darkMode }) => {
    return (
        <div className={`mac-window ${darkMode ? 'dark' : 'light'}`}>
            <div className="outer">
                <div className="dot red"></div>
                <div className="dot amber"></div>
                <div className="dot green"></div>
            </div>
            <div className="container">{ children }</div>
        </div>
    )
}

export default MacWindow