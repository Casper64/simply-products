import { Project } from 'models/Project'
import Link from 'next/link'
import React from 'react'
import Img from '@/components/Img'

import FolderClosed from "~/assets/folder.svg"

interface ProjectProps {
    project: Project
}

const Project: React.FC<ProjectProps> = (props) => {
    return (
        <Link passHref href={`/projects/${props.project._id}`}>
            <div className="project with-icon">
                <Img className="img folder-closed" src={FolderClosed.src}
                    alt="folder-closed"/>

                <p>{props.project.name}</p>
            </div>
        </Link>
    )
}

export default Project