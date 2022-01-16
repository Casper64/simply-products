import React, { createElement, Fragment } from "react"
import { useContextMenu } from "@/hooks";
// import { any, FileDB } from '../../filedb/index';
import store from '@/store';
import { observer } from 'mobx-react-lite';

import FileImage from "~/assets/file.svg";
import Img from '@/components/ui/Img'

interface FileProps {
    step: number;
    doc: any;
};

export const File: React.FC<FileProps> = observer((props) => {
    const { doc, step } = props;
    const {
        rightClick,
        keyUpContextMenu,
        setTextElement,
        selected,
        forceSelect,
        rename,
        setRename
    } = useContextMenu({store: store.fileTreeStore, document: doc});

    const nestedBorders = () => {
        if (step > 2) {
            return (
                <div className="nested-borders">
                    {new Array(step-2).fill(0).map((v, i) => {
                        return <div key={i} className="nested-border"></div>
                    })}
                </div>
            )
        }
        else return 
    }

    const selectDocument = async () => {
        store.fileTreeStore.setSelected(doc);
        // TODO: select document callback
    }

    return (
        <Fragment>
            <div className={`file with-icon ${(selected || forceSelect) ? 'selected' : ''}`} 
                onClick={selectDocument} 
                onContextMenu={rightClick}>
                { nestedBorders() }
                <Img src={FileImage.src} alt="file"/>
                    <p style={{display: rename ? 'none' : 'block'}}>
                        { doc.name }
                    </p>
                <input style={{display: rename ? 'block' : 'none'}}
                //@ts-ignore
                    ref={setTextElement}
                    onKeyUp={keyUpContextMenu} 
                    onBlur={() => {
                    setRename(false)
                    }}
                />
            </div>
        </Fragment>
    )
});
