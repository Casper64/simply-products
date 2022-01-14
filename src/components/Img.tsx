import React from 'react'
import Image from 'next/image'

interface ImgProps {
    src: string;
    className?: string;
    alt: string;
    onClick?: React.MouseEventHandler<HTMLImageElement>;
}

export const Img: React.FC<ImgProps> = (props) => {
    return (
        <div className={`img ${props.className ?? ''}`}>
            <Image 
                onClick={props.onClick}
                layout="fill"
                src={props.src}
                alt={props.alt}
            />
        </div>
    )
}

export default Img