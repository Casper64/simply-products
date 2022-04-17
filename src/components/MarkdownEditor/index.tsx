import { CSSProperties, FC, Fragment, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import styles from './NotesEditor.module.scss'
import { Editor } from './Editor'
import Preview from './Preview'
import classNames from 'classnames'
import { Document } from 'models/Document'
import store from '@/store'

interface NoteEditorProps {
    note: Document;
    layout: string;
    onChange?: (doc: string) => void;
}

export const NoteEditor: FC<NoteEditorProps> = ({ note, layout, onChange }) => {
    const [doc, setDoc] = useState<string>('')
    const [initialDoc, setInitialDoc] = useState<string>('')

    const [height, setHeight] = useState('unset' as string | number)

    useEffect(() => {
        setDoc('')
        if (!note) return
        const content = note.code
        setDoc(content)
        setInitialDoc(content)
    }, [note])

    useEffect(() => {
        calculateHeight();
        window.addEventListener("resize", calculateHeight);
        return () => window.removeEventListener("resize", calculateHeight);
    })

    const calculateHeight = () => {
        if (onChange) return

        let height = window.innerHeight - 140;
        if (window.innerWidth < 768) {
            height = window.innerHeight - 420;
        }
        setHeight(height)
    }


    const handleDocChange = useCallback(newDoc => {
        setDoc(newDoc)
        if (onChange) {
            onChange(newDoc)
        }
        else {
            store.fileTreeStore.setCode(newDoc);
        }
    }, [])

    return (note && doc) ? (
        <div className={classNames(styles["markdown-container"], {[styles["split"]]: layout == "split"})} style={{ height: height }}>
            <Editor style={{display: (layout == "split" || layout == "code") ? 'grid' : 'none'}} onChange={handleDocChange} initialDoc={initialDoc}/>
            <Preview style={{display: (layout == "split" || layout == "preview") ? 'block' : 'none'}} doc={doc}/>
        </div>
    ) : (
        <Fragment/>
    )
}

