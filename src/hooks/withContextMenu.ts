import { useEffect, useState } from "react";
import { FileTreeStore } from "@/store";
import axios from "axios";
import { Document } from "~/models/Document";


interface UseContextMenuProps {
    store: FileTreeStore;
    document: Document
}

// This hook is used to simplify the creation of the context menu of the filetree
export const useContextMenu = ({store, document}: UseContextMenuProps) => {
    let [selected, setSelected] = useState(Boolean(store.selected?._id === document._id));
    let [forceSelect, setForceSelected] = useState(false);
    let [rename, setRename] = useState(false);
    let textNode: HTMLInputElement;

    // Callback when the context menu is opened
    const rightClick: React.MouseEventHandler<HTMLDivElement> = (event) =>{
        event.preventDefault();
        store.setContextMenu({
            open: true,
            document,
            style: {
                top: event.pageY+"px",
                left: event.pageX+"px"
            },
            rename: false
        });
        store.addContextMenuCallback(closeContextMenu);
        setForceSelected(true);
    }
    // Callback when the context menu is closed
    const closeContextMenu = () => {
        store.removeContextMenuCallback(closeContextMenu);
        if (store.contextMenu.rename) {
            setRename(true);
            textNode.focus();
        }
        else {
            setForceSelected(false);
        }
    }
    // Callback when the user types in the created input
    const keyUpContextMenu = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (document === null) return;
        // If the user presses escape close the context menu and remove the created input
        if (event.key == "Escape") {
            textNode.innerHTML = document.name;
            setRename(false);
            setForceSelected(false);
            textNode.blur();
            store.setContextMenu({...store.contextMenu, rename: false})
        }
        // If the uses presses enter or the input is empty close the context menu and remove the created input
        // Should automatically trigger the callbacks when a file or folder is renamed / deleted
        else if (event.key == "Enter") {
            setForceSelected(false);
            setRename(false);
            document.name = textNode.value.trim();
            await axios.put(`/api/documents/${document._id}`, document);
            store.documents.updateModel(document);
            textNode.blur();
            store.setContextMenu({...store.contextMenu, rename: false})
        }
    }

    const setTextElement = (element: HTMLInputElement) => {
        if (!element) return
        textNode = element;
    }
    // Select the currenwt doucment when the user selects another file / document (with the contextmenu)
    useEffect(() => {
        setSelected(store.selected?._id === document._id);
    })

    return {
        rightClick,
        keyUpContextMenu,
        setTextElement,
        selected,
        setSelected,
        forceSelect,
        rename,
        setRename
    }
}