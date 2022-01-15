import React, { ReactNode, useEffect, useRef, useState } from 'react'
import Home from '@/pages/dashboard'
import { Page } from 'types'
import { useRouter } from 'next/router'
import store from '@/store'
import Project from '@/components/Project'
import axios from 'axios'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { Category } from '~/models/Category'
import { observer } from 'mobx-react'
import DangerZone from '@/components/DangerZone'


const CategoryPage: Page = observer(() => {
    const categories = store.databaseStore.categories.models;
    const projects = store.databaseStore.projects.models;
    // const [projects, setProjects] = useState(store.databaseStore.projects.models);

    const router = useRouter();
    const [id, setId] = useState(router.query.id);
    const [add, setAdd] = useState(false);
    const { user } = useUser();
    const inputEl = useRef(null as HTMLInputElement | null);
    

    const getProjects = () => {
        if (!id) return []
        return projects.filter(p => p.category == id)
    }

    const getCategory = () => {
        if (!id) return undefined
        return categories.find(c => c._id === (id as string))
    }

    const handleEscape
        : React.KeyboardEventHandler<HTMLInputElement> = async (event) => {
            if (event.key === "Escape") {
                setAdd(false);
            }
            else if (event.key === "Enter" && inputEl.current?.value.trim().length != 0) {
                const { data } = await axios.post('/api/projects', {
                    name: inputEl.current?.value,
                    public: false,
                    category: id as string,
                    owner: user?.sub
                })
                const project = data.data;
                store.databaseStore.projects.addModel(project);
                setAdd(false);
            }
    }

    const deleteCategory = async () => {
        const { data } = await axios.delete(`/api/categories/${getCategory()?._id}`)
        if (data.success) {
            router.push('/dashboard')
        }
    }

    const renameCategory = async (name: string) => {
        let cat = {
            ...getCategory(),
            name
        } as Category
        await axios.put(`/api/categories/${getCategory()?._id}`, cat);
        store.databaseStore.categories.updateModel(cat)
    }

    useEffect(() => {
        setId(router.query.id)
        if (!id) {
            router.push('/dashboard');
        }
    }, [router, id])

    useEffect(() => {
        if (add) {
            inputEl.current?.focus();
        }
    }, [add])

    return (
        <div className="settings-display">
            <p className="title">Dashboard { getCategory()?.name }</p>
            <div className="card projects-list">
                <div className="header">
                    <p>Projects</p>
                </div>
                <div className="projects-list-container">
                    { getProjects().map(project => {
                        return <Project key={project._id} project={project}/>
                    })}
                    { add && <div className="project new">
                        <input 
                            type="text" 
                            ref={inputEl}
                            onBlur={() => setAdd(false)}
                            onKeyUp={handleEscape}/>
                    </div> }
                    <div className="project add" onClick={() => setAdd(true)}>
                        <p>Add project</p>
                    </div>
                </div>
            </div>
            <DangerZone 
                model={getCategory()}
                delete={deleteCategory}
                rename={renameCategory} 
            />
        </div>
    )
})

export const getServerSideProps = withPageAuthRequired({
    returnTo: '/dashboard'
})


// TODO: STORE PROJECTS AND CATEGORIES IN STORE!!!

CategoryPage.getLayout = (page: ReactNode) => {
    return (
        <Home>
            {page}
        </Home>
    )
}


export default CategoryPage