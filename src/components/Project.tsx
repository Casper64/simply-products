import { Project } from 'models/Project'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

import FolderClosed from "~/assets/folder.svg"

interface ProjectProps {
    project: Project
}

const Project: React.FC<ProjectProps> = (props) => {
    return (
        <Link passHref href={`/projects/${props.project._id}`}>
            <div className="project with-icon">
                <div className="img folder-closed">
                <Image
                    src={FolderClosed.src}
                    layout="fill"
                    alt="folder-closed"/>
                </div>
                <p>{props.project.name}</p>
            </div>
        </Link>
    )
}

export default Project