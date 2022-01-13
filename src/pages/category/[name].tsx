import React, { ReactNode, useEffect, useRef, useState } from 'react'
import Home from '@/pages/index'
import { Page } from 'types'
import { useRouter } from 'next/router'
import store from '@/store'
import Project from '@/components/Project'
import axios from 'axios'


const CategoryPage: Page = () => {
    const categories = store.databaseStore.categories.models;
    const projects = store.databaseStore.projects.models;
    // const [projects, setProjects] = useState(store.databaseStore.projects.models);

    const router = useRouter();
    const [id, setId] = useState(router.query.id);
    const [add, setAdd] = useState(false);
    const inputEl = useRef(null as HTMLInputElement | null);

    const getProjects = () => {
        if (!id) return []
        return projects.filter(p => p.category == id)
    }

    const getCategory = () => {
        if (!id) return null
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
                    category: id as string
                })
                const project = data.data;
                store.databaseStore.projects.addModel(project);
                setAdd(false);
            }
    }
    
    useEffect(() => {
        setId(router.query.id)
        if (!id) {
            router.push('/');
        }
    }, [router, id])

    useEffect(() => {
        if (add) {
            inputEl.current?.focus();
        }
    }, [add])

    return (
        <div className="projects-display">
            <p className="title">Dashboard { getCategory()?.name }</p>
            <div className="projects-list">
                <div className="header">
                    <p>Projects</p>
                </div>
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
    )
}


// TODO: STORE PROJECTS AND CATEGORIES IN STORE!!!

CategoryPage.getLayout = (page: ReactNode) => {
    return (
        <Home>
            {page}
        </Home>
    )
}


export default CategoryPage