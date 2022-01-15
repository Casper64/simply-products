import React from 'react'

interface UseSVGProps {
    xlinkHref: string;
}

const UseSVG: React.FC<UseSVGProps> = ({ xlinkHref }) => {
    return (
        <svg>
            <use xlinkHref={xlinkHref+"#img"}></use>
        </svg>
    )
}
export default UseSVG;