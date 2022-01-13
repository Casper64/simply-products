import { useEffect, useState } from "react";
import { FileTreeStore } from "@/store";
// import { FileDB, any } from "../filedb";


interface UseContextMenuProps {
    store: FileTreeStore;
    document: any
}

export const useContextMenu = ({store, document}: UseContextMenuProps) => {
    let [selected, setSelected] = useState(Boolean(store.selected));
    let [forceSelect, setForceSelected] = useState(false);
    let [rename, setRename] = useState(false);
    let textNode: HTMLParagraphElement;

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

    const keyUpContextMenu = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (document === null) return;
        if (event.key == "Escape") {
            textNode.innerHTML = document.name;
            setRename(false);
            setForceSelected(false);
            textNode.blur();
            store.setContextMenu({...store.contextMenu, rename: false})
        }
        else if (event.key == "Enter") {
            setForceSelected(false);
            setRename(false);
            document.name = textNode.innerText;
            // await commitObject(document);
            store.changeDocument(document);
            textNode.blur();
            store.setContextMenu({...store.contextMenu, rename: false})
        }
    }

    const setTextElement = (element: HTMLParagraphElement) => {
        if (element === null) return
        textNode = element;
    }

    useEffect(() => {
        setSelected(store.selected === document.id);
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