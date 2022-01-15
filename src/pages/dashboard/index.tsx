import dbConnect from 'lib/dbConnect'
import CategoryModel, { Category } from 'models/Category'
import ProjectModel, { Project } from 'models/Project'
import { Sidebar } from '@/components/Sidebar'
import { useEffect } from 'react'
import { Page } from 'types'
import store from '@/store'
import { Claims, useUser, withPageAuthRequired, getSession } from '@auth0/nextjs-auth0'


interface HomePageProps {
    categories?: Category[];
    projects?: Project[];
    user?: Claims | null
}

const Home: Page<HomePageProps> = ({ children, categories, projects, user }) => {

    useEffect(() => {
        if (categories) store.databaseStore.categories.setModels(categories);
        if (projects) store.databaseStore.projects.setModels(projects);
    }, [categories, projects])

    return (
        <div className="home">
            <Sidebar/>
            <section className="category-container">
                { children }
                { !children && 
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

        let result = await CategoryModel.find({owner});
        let categories = result.map((doc) => {
            const category = doc.toObject()
            category._id = category._id.toString();
            return category
        }) as Category[]

        let result2 = await ProjectModel.find({owner});
        let projects = result2.map((doc) => {
            const project = doc.toObject()
            project._id = project._id.toString();
            project.category = project.category.toString();
            return project
        }) as Project[]

        return {
            props: {
                categories,
                projects
            }
        }
    }
})

export default Home
