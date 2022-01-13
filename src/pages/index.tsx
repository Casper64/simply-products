import dbConnect from 'lib/dbConnect'
import CategoryModel, { Category } from 'models/Category'
import ProjectModel, { Project } from 'models/Project'
import type { NextPage } from 'next'
import useSWR from 'swr'
import axios from 'axios'
import { Sidebar } from '@/components/Sidebar'
import { useEffect, useState } from 'react'
import { Page } from 'types'
import store from '@/store'
import { observer } from 'mobx-react'


interface HomePageProps {
    categories?: Category[];
    projects?: Project[];
}

const Home: Page<HomePageProps> = ({ children, categories, projects }) => {
    
    if (categories) store.databaseStore.categories.setModels(categories);
    if (projects) store.databaseStore.projects.setModels(projects);

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


export async function getServerSideProps() {
    await dbConnect();

    let result = await CategoryModel.find({});
    let categories = result.map((doc) => {
        const category = doc.toObject()
        category._id = category._id.toString();
        return category
    }) as Category[]

    let result2 = await ProjectModel.find({});
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

export default Home
