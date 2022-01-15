import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import store from '@/store'
import { Category } from 'models/Category';
import Img from '@/components/Img'

import FolderClosed from "~/assets/folder.svg"
import FolderOpen from "~/assets/folder-open.svg"
import axios from 'axios';
import { useUser } from '@auth0/nextjs-auth0';


export const Sidebar: React.FC = () => {
    const categories = store.databaseStore.categories.models;
    const [selected, setSelected] = useState(0);
    const [add, setAdd] = useState(false);
    const inputEl = useRef(null as HTMLInputElement | null);
    const router = useRouter();
    const { user } = useUser();

    const goto = (category: Category) => {
        router.push(
            `/dashboard/category/${category.name}?id=${category._id}`,
            `/dashboard/category/${category.name}`,
            {
                shallow: true
            }
        )
    }

    const handleEscape
        : React.KeyboardEventHandler<HTMLInputElement> = async (event) => {
            if (event.key === "Escape") {
                setAdd(false);
            }
            else if (event.key === "Enter" && inputEl.current?.value.trim().length != 0) {
                const { data } = await axios.post('/api/categories', {
                    name: inputEl.current?.value,
                    public: false,
                    owner: user?.sub
                })
                const category = data.data;
                store.databaseStore.categories.addModel(category);
                setAdd(false);
            }
    }

    useEffect(() => {
        if (add) {
            inputEl.current?.focus();
        }
    }, [add])

    return (
        <div className="sidebar">
            <div className="sidebar-group">
                <p className="title">FOLDERS</p>
                { categories.map(category => {
                    return (
                        <div 
                            key={category._id}
                            className={`sidebar-element category with-icon ${category._id === router.query.id ? 'selected' : ''}`}
                            onClick={() => goto(category)}
                            id={category._id}
                        >
                            <Img className="img folder-closed" src={FolderClosed.src}
                                alt="folder-closed" />
                            <Img className="img folder-open" src={FolderOpen.src}
                                alt="folder-open"/>
  
                            <p>{category.name}</p>
                        </div>
                    )
                }) }
                { add && <div className="sidebar-element category new">
                     <input 
                        type="text" 
                        ref={inputEl}
                        // onBlur={() => setAdd(false)}
                        onKeyUp={handleEscape}/>
                </div> }
                <div 
                    className="sidebar-element category add"
                    onClick={() => setAdd(true)}
                >
                    <p>Add Folder</p>
                </div>
            </div>
        </div>
    )
}
