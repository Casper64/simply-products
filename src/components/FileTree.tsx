import React, { Component, ReactNode, createElement, useState } from "react";
import ReactDom from "react-dom"

import { Folder } from "@/components/Folder";

import { ContextMenuCallback, FileTreeStore } from "@/store"

// import { configure } from "mobx";

export interface FileTreeProps {
    documents: any[]
}

export const FileTree: React.FC<FileTreeProps> = ({ documents }) => {

    const [openContextMenu, setOpenContextMenu] = useState(false);
    const contextMenu: ContextMenuCallback = ({open}) => {
        setOpenContextMenu(open);
    }

    const store = new FileTreeStore({
        contextMenuCallback: contextMenu
    });
    store.setDocuments(documents);


   

    const closeContextMenu = () => {
        store.setContextMenu({
           ...store.contextMenu,
            document: null,
            open: false
        })
    }

    const renameFile = () => {
        if (store.contextMenu.document === null) return;
        store.setContextMenu({...store.contextMenu, rename: true});
    }

    const deleteFile = async () => {
        if (store.contextMenu.document === null) return;
        const { document } = store.contextMenu;
        if (window.confirm("Are you sure you want to delete this document?")) {
            store.removeDocument(document);
        }
    }

    document.addEventListener("click", closeContextMenu);

    return (
        <div className={`filetree-container`}>
            <Folder
                store={store}
                className="root-name open"
                step={1}
            />
            { openContextMenu && ReactDom.createPortal(
                (
                    <div className="context-menu"
                        style={store.contextMenu.style}>
                        <p id="context-menu-rename" onClick={renameFile}>Rename</p> 
                        <p id="context-menu-delete" onClick={deleteFile}>Delete</p>
                    </div>
                ),
                document.body
            )}
        </div>
    )
}
