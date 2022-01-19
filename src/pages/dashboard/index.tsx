import dbConnect from 'lib/dbConnect'
import ProjectModel, { Project } from 'models/Project'
import { Sidebar } from '@/components/ui/Sidebar'
import { useEffect } from 'react'
import { Page } from 'types'
import store from '@/store'
import { Claims, withPageAuthRequired, getSession } from '@auth0/nextjs-auth0'
import DashboardSettings from '@/components/DashboardSettings'


interface HomePageProps {
    projects: Project[];
    user: Claims | null
}

const Home: Page<HomePageProps> = ({ projects, user }) => {

    useEffect(() => {
        if (projects) store.databaseStore.projects.setModels(projects);
    }, [projects])

    return (
        <div className="dashboard">
            <section className="category-container">
                { <DashboardSettings  projects={projects}/> }
                { !projects && 
                    <h1  className="title">Select or add a folder to get started</h1>
                }
            </section>
        </div>
    )
}


export const getServerSideProps = withPageAuthRequired({
    returnTo: '/dashboard'  ,
    async getServerSideProps(context) {
        await dbConnect();
        
        let s  = getSession(context.req, context.res);
        const owner: string = s?.user.sub;


        let result = await ProjectModel.find({owner});
        let projects = result.map((doc) => {
            const project = doc.toObject()
            project._id = project._id.toString();
            return project
        }) as Project[]

        projects = projects || [];

        return {
            props: {
                projects
            }
        }
    }
})

export default Home
