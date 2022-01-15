import React, { useEffect, useState } from 'react'
import Home from '@/pages/dashboard'
import { Page } from 'types'
import { useRouter } from 'next/router'
import store, { ContextMenuCallback, FileTreeStore } from '@/store'
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

interface ProjectPageProps {
    projects: Project[];
    documents: Document[];
}

const ProjectPage: Page<ProjectPageProps> = observer(({ projects, documents }) => {

    const router = useRouter();
    const [id, setId] = useState(router.query.id);
    const [project, setProject] = useState(projects?.find(p => p._id === id));
    
    const selected = store.fileTreeStore.selected;

    useEffect(() => {
        setId(router.query.id)
        setProject(projects?.find(p => p._id === id))
        if (documents) store.fileTreeStore.documents.setModels(documents);
    }, [router, id, project])
    
    return (
        <div className="project-page">
            <div className="folder-container">
                <div className="nav-header">
                    <p>EXPLORER</p>
                    {/* Implement Rights display */}
                    <p className="rights">owner</p> 
                    <div className="settings-icon">
                        <Img src={Cog.src} alt="cog"/>
                    </div>
                </div>
                <FileTree project={project}/>
            </div>
            <nav></nav>
            <div className={`markdown-container ${selected ? '' : 'no-selected'}`}>
                { selected === null && <h1 className="title">Select or create a file to get started!</h1> }
                { selected !== null && 
                <>
                    <MarkdownEditor selected={selected}/>
                    <MarkdownPreview selected={selected}/>
                </>	
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