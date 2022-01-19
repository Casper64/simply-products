import React, { useEffect, useState } from 'react'
import { Page } from 'types'
import { useRouter } from 'next/router'
import store from '@/store'
import dbConnect from 'lib/dbConnect'
import ProjectModel, { Project } from 'models/Project'
import DocumentModel, { Document } from 'models/Document'
import { FileTree } from '@/components/filetree/FileTree'
import Img from '@/components/ui/Img'
import Cog from '~/assets/cog.svg'
import { GetServerSidePropsContext } from 'next/types'
import { observer } from 'mobx-react'
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import DangerZone from '@/components/DangerZone'
import axios from 'axios'
import Editor from '@/components/Editor'
import ProjectNav from '@/components/ui/ProjectNav'

interface ProjectPageProps {
    project: Project;
    documents: Document[];
}

const ProjectPage: Page<ProjectPageProps> = observer(({ project: p, documents }) => {
    const router = useRouter();
    const [id, setId] = useState(router.query.id);
    const [layout, setLayout] = useState('code');
    const [project, setProject] = useState(p);
    
    const selected = store.fileTreeStore.selected;

    const deleteProject = async () => {
        const { data } = await axios.delete(`/api/projects/${project?._id}`);
        if (data.success) {
            router.push('/dashboard');
        }
    }
    const renameProject = async (name: string) => {
        let p = {
            ...project,
            name
        } as Project
        await axios.put(`/api/projects/${project?._id}`, p)
        store.databaseStore.projects.updateModel(p)
        setProject(p);
    }

    useEffect(() => {
        setId(router.query.id)
        if (documents) store.fileTreeStore.documents.setModels(documents);
    }, [router, id, project, documents])

    useEffect(() => {
        store.addEventListener('editor-layout', setLayout);
        return () => {
            store.removeEventListener('editor-layout', setLayout);
        }
    }, [])
    
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
                { selected !== null && layout !== 'settings' && id &&
                    <Editor selected={selected}/>
                }
                { selected === null && layout === 'settings' &&
                    <div className="settings-display">
                        <p className="title">Settings { project?.name }</p>
                        <div className="card">
                            <div className="header">
                                <p>Project</p>
                            </div>
                        </div>
                        <DangerZone 
                            model={project} 
                            delete={deleteProject}
                            rename={renameProject}/>
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

        let result = await ProjectModel.find({owner, _id: id});
        let project = result.map((doc) => {
            const project = doc.toObject()
            project._id = project._id.toString();
            return project
        })[0] as Project | null

        
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
                project,
                documents
            }
        }
    }
})

export default ProjectPage