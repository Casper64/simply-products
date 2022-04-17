import React, { useState, useEffect } from "react";

import { Folder } from "@/components/filetree/Folder";

import store, { ContextMenuCallback } from "@/store"
import { Project } from "~/models/Project";
import axios from 'axios'

export interface FileTreeProps {
    project?: Project
}

export const FileTree: React.FC<FileTreeProps> = ({ project }) => {
    

    const [openContextMenu, setOpenContextMenu] = useState(false);

    const contextMenu: ContextMenuCallback = ({open}) => {
        setOpenContextMenu(open);
        setContextMenuStyle(store.fileTreeStore.contextMenu.style);
    }
    store.fileTreeStore.addContextMenuCallback(contextMenu);

    const closeContextMenu = () => {
        store.fileTreeStore.setContextMenu({
            ...store.fileTreeStore.contextMenu,
            document: undefined,
            open: false
        })
    }

    const [contextMenuStyle, setContextMenuStyle] = useState(store.fileTreeStore.contextMenu.style)
    
    const renameFile = () => {
        if (store.fileTreeStore.contextMenu.document === undefined) return;
        store.fileTreeStore.setContextMenu({...store.fileTreeStore.contextMenu, rename: true});
    }

    const deleteFile = async () => {
        if (store.fileTreeStore.contextMenu.document === undefined) return;
        const { document } = store.fileTreeStore.contextMenu;
        if (window.confirm(`Are you sure you want to delete "${document.name}"${document.folder ? " and its contents" : ''}?`)) {
            await axios.delete('/api/documents', {
                data: { parent: document._id }
            });
            await axios.delete(`/api/documents/${document._id}`)
            store.fileTreeStore.documents.deleteManyModels({
                parent: document._id
            })
            store.fileTreeStore.documents.deleteModel(document);
        }
        if (store.fileTreeStore.selected === document._id) store.fileTreeStore.setSelected(null)
    }

    useEffect(() => {
        window.addEventListener("click", closeContextMenu);
        return () => window.removeEventListener("click", closeContextMenu);
    })

    return project ? (
        <div className={`filetree-container`}>
            <Folder
                className="root-name open"
                step={1}
                root={project}
                project={project}
            />
            { openContextMenu && (
                <div className="context-menu"  style={{top: contextMenuStyle.top, left: contextMenuStyle.left}}>
                    <p id="context-menu-rename" onClick={renameFile}>Rename</p> 
                    <p id="context-menu-delete" onClick={deleteFile}>Delete</p>
                </div>
            )}
        </div>
    ) : <div className="filetree-container"></div>
}
