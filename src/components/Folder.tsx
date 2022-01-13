import React, { useState, useEffect, ReactElement, Fragment } from 'react';
import { File } from './File'

import FolderClosed from "~/assets/folder.svg"
import FolderOpen from "~/assets/folder-open.svg"
import AddFile from "~/assets/add-file.svg"
import AddFolder from "~/assets/add-folder.svg"
import FileImage from "~/assets/file.svg"

import { useContextMenu } from "@/hooks";
import { FileTreeStore } from '@/store';
import { observer } from 'mobx-react-lite';

interface FolderProps {
    store: FileTreeStore;
    className: string;
    step: number;
    root?: any;
}

export const Folder: React.FC<FolderProps> = observer((props) => {
    const { className, step, store } = props;
    let [children, setChildren] = useState([] as ReactElement[]);
    let [documents, setDocuments] = useState(store.documents);
    let [open, setOpen] = useState(false);
    let tempInput: HTMLInputElement | null = null;
    let root = props.root;
    if (root == undefined) {
        // root = store.documents.find(d => d.is_root = true);
    }

    const {
        rightClick,
        keyUpContextMenu,
        setTextElement,
        forceSelect,
        rename,
        setRename
    } = useContextMenu({store, document: root});

    const getRoot = () => {
        // return documents.find(d => d.is_root);
    }

    const nextLayer = (documents: any[]) => {
        
        documents = documents.filter((d) => {
            return d.parent === root.id;
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
                            let newProps = {...props};
                            newProps.className = "";
                            newProps.step += 1;
                            newProps.root = d.getGuid();
                            return <Folder {...newProps} />
                            // return <div className="nested-container"></div> 
                        }
                        else {
                            let newProps = {...props};
                            newProps.step += 1;
                            return <File 
                                doc={d}
                                {...props}
                            />
                        }
                    }) }
                </Fragment>
            )
            if (root.id === getRoot()/* .id */) {
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

    const setNewDocument = async (folder: boolean) => {
        if (tempInput === null || tempInput.value.replace(/\s/g, "") === "") {
            blurInput();
            return
        }
        blurInput();

        const name = tempInput.value;
        let document: any = {
            id: Date.now(),
            name,
            parent: root.id,
            folder
        };
        store.addDocument(document);
    }

    const addFile: React.MouseEventHandler<SVGSVGElement> = (e) => {
        e.stopPropagation();
        setOpen(true);
        setChildren([
            (
                <div key="temp-file" className="with-icon temp">
                    { nestedBorders(step) || <div className="nested-borders"></div> }
                    <FileImage/>
                    <input 
                        type="text" 
                        ref={setTempInput}
                        onBlur={() => setNewDocument(false)} onKeyUp={(event) => keyUp(event, false) }
                    />
                </div>
            )
        ]);
    }
    const addFolder: React.MouseEventHandler<SVGSVGElement> = (e) => {
        e.stopPropagation();
        setOpen(true);
        setChildren([
            (
                <div key="temp-folder" className="with-icon temp">
                    { nestedBorders(step) || <div className="nested-borders"></div> }
                    <FolderOpen />
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
        setDocuments(store.documents)
    }, [store]);

    const selectDocument = async () => {
        setOpen(!open);
        // TODO: select document callback
    }

    return (
        <Fragment>
            <div className={`${className} folder with-icon ${open ? 'open' : ''} ${forceSelect ? 'selected' : ''}`} 
                onClick={selectDocument} 
                onContextMenu={rightClick}>
                { nestedBorders(step-1) }
                <FolderClosed className="folder-closed"/>
                <FolderOpen className="folder-open"/>
                <p ref={setTextElement} 
                    contentEditable={ rename ? true : false} 
                    onKeyUp={keyUpContextMenu} 
                    onBlur={() => {
                        setRename(false)
                }}>
                    { root.name }
                </p>
                <AddFolder onClick={addFolder} className="add-icon" />
                <AddFile onClick={addFile} className="add-icon" />
            </div>
            { nextLayer(documents) }
        </Fragment>
    )
    
});