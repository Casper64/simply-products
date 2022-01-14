import React, { useState, useEffect, ReactElement, Fragment } from 'react';
import { File } from './File'

import FolderClosed from "~/assets/folder.svg"
import FolderOpen from "~/assets/folder-open.svg"
import AddFile from "~/assets/add-file.svg"
import AddFolder from "~/assets/add-folder.svg"
import FileImage from "~/assets/file.svg"

import { useContextMenu } from "@/hooks";
import store from '@/store';
import { observer } from 'mobx-react-lite';
import { Document } from 'models/Document';
import { Project } from 'models/Project';
import Img from '@/components/Img'
import axios from 'axios';

interface FolderProps {
    className: string;
    step: number;
    root: Document | Project;
    project: Project;
}

export const Folder: React.FC<FolderProps> = observer((props) => {
    let { className, step, root, project } = props;
    let [children, setChildren] = useState([] as ReactElement[]);
    let [documents, setDocuments] = useState(store.fileTreeStore.documents.models);
    let [open, setOpen] = useState(false);
    let tempInput: HTMLInputElement | null = null;
    //@ts-ignore
    if (!root) root = project as Document;
    
    const {
        rightClick,
        keyUpContextMenu,
        setTextElement,
        forceSelect,
        rename,
        setRename
        //@ts-ignore
    } = useContextMenu({store: store.fileTreeStore, document: root});


    const nextLayer = (documents: Document[]) => {
        
        documents = documents.filter((d) => {
            return d.parent === root._id;
        })
        documents.sort(doc => {
            return doc.folder ? -1 : 1
        })
        if (documents!.length > 0) {
            const Content = (
                <Fragment>
                    { children }
                    { documents.map(d => {
                        if (d.folder) {
                            return <Folder key={d._id} root={d} step={step + 1} className='' project={project}/>
                            // return <div className="nested-container"></div> 
                        }
                        else {
                            return <File 
                                key={d._id}
                                doc={d}
                                step={step + 1}
                            />
                        }
                    }) }
                </Fragment>
            )
            if (root._id === project._id) {
                return Content;
            }
            else {
                return (
                    <div className={`nested-container ${open ? ''  : 'closed'}`}>
                        { Content }
                    </div> 
                )
            }
        }
        return <div className={`nested-container ${open ? ''  : 'closed'}`}>{ children }</div> 
    }
    
    const nestedBorders = (s = step) => {
        if (s > 1) {
            return (
                <div className="nested-borders">
                    {new Array(s-1).fill(0).map((v, i) => {
                        return <div key={i} className="nested-border"></div>
                    })}
                </div>
            )
        }
        else return 
    }

    // TODO: update temp input to hook like in '@/components/Sidebar.tsx'
    const setNewDocument = async (folder: boolean) => {
        if (tempInput === null || tempInput.value.trim().length === 0) {
            blurInput();
            return
        }
        blurInput();

        const { data } = await axios.post('/api/documents', {
            name: tempInput.value,
            folder,
            parent: root._id,
            project: project._id,
            code: '# Hello world'
        });
        const doc = data.data;
        if (doc.folder === false) store.fileTreeStore.setSelected(doc);
        store.fileTreeStore.documents.addModel(doc);
    }

    const addFile: React.MouseEventHandler<HTMLImageElement> = (e) => {
        e.stopPropagation();
        setOpen(true);
        setChildren([
            (
                <div key="temp-file" className="with-icon temp">
                    { nestedBorders(step) || <div className="nested-borders"></div> }
                    <Img src={FileImage.src} alt="file"/>
                    <input 
                        type="text" 
                        ref={setTempInput}
                        onBlur={() => setNewDocument(false)} onKeyUp={(event) => keyUp(event, false) }
                    />
                </div>
            )
        ]);
    }
    const addFolder: React.MouseEventHandler<HTMLImageElement> = (e) => {
        e.stopPropagation();
        setOpen(true);
        setChildren([
            (
                <div key="temp-folder" className="with-icon temp">
                    { nestedBorders(step) || <div className="nested-borders"></div> }
                    <Img className="folder-closed" src={FolderClosed.src}
                        alt="folder-closed"/>
                    <input 
                        type="text" 
                        ref={setTempInput}
                        onBlur={() => setNewDocument(true)} onKeyUp={(event) => keyUp(event, true) }
                    />
                </div>
            )
        ]);
    }

    const setTempInput = (element: HTMLInputElement) => {
        if (element === null) return
        tempInput = element;
        tempInput.focus();
    }

    const blurInput = () => {
        setChildren([])
    }

    const keyUp = (event: React.KeyboardEvent<HTMLInputElement>, folder: boolean) => {
        if (event.key == "Escape") {
            blurInput();
        }
        else if (event.key == "Enter") {
            setNewDocument(folder);
        }
    }

    useEffect(() => {
        setDocuments(store.fileTreeStore.documents.models)
    });

    const selectDocument = async () => {
        setOpen(!open);
        // TODO: select document callback
    }

    return (
        <Fragment>
            <div className={`${className} folder with-icon ${open ? 'open' : ''} ${forceSelect ? 'selected' : ''}`} 
                onClick={selectDocument} 
                onContextMenu={(event) => {
                    if (root._id === project._id) return
                    rightClick(event);
                }}>
                { nestedBorders(step-1) }
                <Img className="folder-closed" src={FolderClosed.src}
                    alt="folder-closed"/>
                <Img className="folder-open" src={FolderOpen.src}
                    alt="folder-open"/>
                <p style={{display: rename ? 'none' : 'block'}}>
                        { root.name }
                    </p>
                <input style={{display: rename ? 'block' : 'none'}}
                //@ts-ignore
                    ref={setTextElement}
                    onKeyUp={keyUpContextMenu} 
                    onBlur={() => {
                    setRename(false)
                    }}
                />
                <Img onClick={addFolder} className="add-icon" src={AddFolder.src}
                    alt="add-folder"/>
                <Img onClick={addFile} className="add-icon" src={AddFile.src}
                    alt="add-file"/>
            </div>
            { nextLayer(documents) }
        </Fragment>
    )
    
});