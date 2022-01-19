import { useUser } from '@auth0/nextjs-auth0';
import { observer } from 'mobx-react'
import React, { useState, useRef, useEffect } from 'react'
import { Project } from '~/models/Project'
import ProjectView from '@/components/ui/Project'
import store from '@/store'
import axios from 'axios'
import { useRouter } from 'next/router';

export interface DashboardSettingsProps {
    projects: Project[];
}

const DashboardSettings: React.FC<DashboardSettingsProps> = observer(() => {
    const [add, setAdd] = useState(false);
    const inputEl = useRef(null as HTMLInputElement | null);
    const projects = store.databaseStore.projects.models;

    const { user } = useUser();
    const router = useRouter();
    
    const handleEscape
        : React.KeyboardEventHandler<HTMLInputElement> = async (event) => {
            if (event.key === "Escape") {
                setAdd(false);
            }
            else if (event.key === "Enter" && inputEl.current?.value.trim().length != 0) {
                const { data } = await axios.post('/api/projects', {
                    name: inputEl.current?.value,
                    public: false,
                    owner: user?.sub
                })
                const project = data.data;
                store.databaseStore.projects.addModel(project);
                router.push(`/books/${project._id}`)
                setAdd(false);
            }
    }

    useEffect(() => {
        if (add) {
            inputEl.current?.focus();
        }
    }, [add])
    
    return (
        <div className="settings-display settings-dashboard">
            <p className="title">Dashboard</p>
            <div className="card projects-list">
                <div className="header">
                    <p>Books</p>
                </div>
                <div className="projects-list-container">
                    { projects.map(project => {
                        return <ProjectView key={project._id} project={project}/>
                    })}
                    { add && <div className="project new">
                        <input 
                            type="text" 
                            ref={inputEl}
                            onBlur={() => setAdd(false)}
                            onKeyUp={handleEscape}/>
                    </div> }
                    <div className="project add" onClick={() => setAdd(true)}>
                        <p>Add book</p>
                    </div>
                </div>
            </div>
            {/* <DangerZone 
                model={getCategory()}
                delete={deleteCategory}
                rename={renameCategory} 
            /> */}
        </div>
    )
})

export default DashboardSettings