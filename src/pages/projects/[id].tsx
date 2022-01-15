import React, { useEffect, useState } from 'react'
import { Page } from 'types'
import { useRouter } from 'next/router'
import store from '@/store'
import dbConnect from 'lib/dbConnect'
import ProjectModel, { Project } from 'models/Project'
import DocumentModel, { Document } from 'models/Document'
import { FileTree } from '@/components/FileTree'
import Img from '@/components/Img'
import Cog from '~/assets/cog.svg'
import { GetServerSidePropsContext } from 'next/types'
import { observer } from 'mobx-react'
import MarkdownPreview from '@/components/MarkdownPreview'
import MarkdownEditor from '@/components/MarkdownEditor'
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import ProjectNav from '@/components/ProjectNav'

interface ProjectPageProps {
    projects: Project[];
    documents: Document[];
}

const ProjectPage: Page<ProjectPageProps> = observer(({ projects, documents }) => {

    const router = useRouter();
    const [id, setId] = useState(router.query.id);
    const [project, setProject] = useState(projects?.find(p => p._id === id));
    const [layout, setLayout] = useState('split');
    
    const selected = store.fileTreeStore.selected;

    useEffect(() => {
        setId(router.query.id)
        setProject(projects?.find(p => p._id === id))
        if (documents) store.fileTreeStore.documents.setModels(documents);
    }, [router, id, project])

    useEffect(() => {
        store.addEventListener('editor-layout', setLayout);
        return () => {
            store.removeEventListener('editor-layout', setLayout);
        }
    })
    useEffect(() => {
        if (layout === 'settings' && selected !== null) {
            setLayout('split')
        }
    }, [selected, layout])
    
    return (
        <div className="project-page">
            <div className="folder-container">
                <div className="nav-header">
                    <p>EXPLORER</p>
                    {/* Implement Rights display */}
                    <p className="rights">owner</p> 
                    <div className="settings-icon" onClick={() => {
                        store.fileTreeStore.setSelected(null);
                        setLayout('settings');
                    }}>
                        <Img src={Cog.src} alt="cog"/>
                    </div>
                </div>
                <FileTree project={project}/>
            </div>
            <ProjectNav></ProjectNav>
            <div className={`markdown-container ${selected ? '' : 'no-selected'} layout-${layout}`}>
                { selected === null && layout !== 'settings' && 
                    <h1 className="title">Select or create a file to get started!</h1>
                }
                { selected !== null && layout !== 'settings' && 
                <>
                    { (layout === 'split' || layout === 'code') &&
                        <MarkdownEditor selected={selected}/>
                    }
                    { (layout === 'split' || layout === 'preview') &&
                        <MarkdownPreview selected={selected}/>
                    }
                </>	
                }
                { selected === null && layout === 'settings' &&
                    <div className="settings-container">
                        <h1>Settings</h1>
                    </div>
                }
            </div>
        </div>
    )
})

export const  getServerSideProps = withPageAuthRequired({
    returnTo: '/dashboard',
    async getServerSideProps (context: GetServerSidePropsContext) {
        await dbConnect();

        let s  = getSession(context.req, context.res);
        const owner: string = s?.user.sub;

        //@ts-ignore
        const id: string = context.params.id;

        let result = await ProjectModel.find({owner});
        let projects = result.map((doc) => {
            const project = doc.toObject()
            project._id = project._id.toString();
            project.category = project.category.toString();
            return project
        }) as Project[]
        
        let result2 = await DocumentModel.find({
            project: id,
            owner
        })
        let documents = result2.map((doc) => {
            const document = doc.toObject()
            document._id = document._id.toString();
            document.parent = document.parent.toString();
            return document
        }) as Document[]

        return {
            props: {
                projects,
                documents
            }
        }
    }
})

export default ProjectPage