import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import store from '@/store'
import { Category } from 'models/Category';
import Image from 'next/image'

import FolderClosed from "~/assets/folder.svg"
import FolderOpen from "~/assets/folder-open.svg"
import axios from 'axios';


export const Sidebar: React.FC = () => {
    const categories = store.databaseStore.categories.models;
    const [selected, setSelected] = useState(0);
    const [add, setAdd] = useState(false);
    const inputEl = useRef(null as HTMLInputElement | null);
    const router = useRouter();

    const goto = (category: Category) => {
        router.push(
            `/category/${category.name}?id=${category._id}`,
            `/category/${category.name}`,
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
                            <div className="img folder-closed">
                                <Image layout="fill"
                                src={FolderClosed.src}
                                alt="folder-closed"/>
                            </div>
                            <div className="img folder-open">
                                <Image  layout="fill"
                                src={FolderOpen.src}
                                alt="folder-open"/>
                            </div>
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
