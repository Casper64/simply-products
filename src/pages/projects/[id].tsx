import React, { useState } from 'react'
import Home from '@/pages/index'
import { Page } from 'types'
import { useRouter } from 'next/router'
import store from '@/store'


const ProjectPage: Page = () => {
    const router = useRouter();
    const [id, setId] = useState(router.query.id);
    
    return (
        <h1>{ id }</h1>
    )
}

export default ProjectPage