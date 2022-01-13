import React, { createElement, Fragment } from "react"
import { useContextMenu } from "@/hooks";
// import { any, FileDB } from '../../filedb/index';
import { FileTreeStore } from '@/store';
import { observer } from 'mobx-react-lite';

import FileImage from "~/assets/file.svg";

interface FileProps {
    step: number;
    doc: any;
    store: FileTreeStore;
};

export const File: React.FC<FileProps> = observer((props) => {
    const { doc, step, store } = props;
    const {
        rightClick,
        keyUpContextMenu,
        setTextElement,
        selected,
        forceSelect,
        rename,
        setRename
    } = useContextMenu({store, document: doc});

    const nestedBorders = () => {
        if (step > 1) {
            return (
                <div className="nested-borders">
                    {new Array(step-1).fill(0).map((v, i) => {
                        return <div key={i} className="nested-border"></div>
                    })}
                </div>
            )
        }
        else return 
    }

    const selectDocument = async () => {
        store.setSelected(doc.id);
        // TODO: select document callback
    }

    return (
        <Fragment>
            <div className={`file with-icon ${(selected || forceSelect) ? 'selected' : ''}`} 
                onClick={selectDocument} 
                onContextMenu={rightClick}>
                { nestedBorders() }
                <FileImage />
                <p ref={setTextElement} 
                    contentEditable={ rename ? true : false} 
                    onKeyUp={keyUpContextMenu} 
                    onBlur={() => {
                        setRename(false)
                }}>
                    { doc.name }
                </p>
            </div>
        </Fragment>
    )
});
