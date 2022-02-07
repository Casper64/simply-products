import { observer } from 'mobx-react'
import dynamic from 'next/dynamic';
import React, { ComponentType, useEffect, useRef, useState } from 'react'
import type { EditorProps } from 'react-draft-wysiwyg';
import { Document } from '~/models/Document'
import store from '@/store'
import axios from 'axios';
import type { ContentBlock, EditorState } from 'draft-js';
import { usePrevious } from '@/hooks/usePrevious'

let EditorComponent: ComponentType<EditorProps>;

interface EditorWrapperProps {
    selected: Document;
}

const EditorWrapper: React.FC<EditorWrapperProps> = ({ selected }) => {
    //@ts-ignore
    const [source, setSource] = useState(null as any);
    const [content, setContent] = useState('');
    const prevSelected = usePrevious(selected);
    const prevContent = usePrevious(content);

    EditorComponent = dynamic(async () => (await import('react-draft-wysiwyg')).Editor, { ssr: false })

    const edit = (state: Draft.DraftModel.Encoding.RawDraftContentState) => {
        setContent(JSON.stringify(state));

    }

    const save = (s = selected, c = content) => {
    if (c.length != 0) {
            store.fileTreeStore.setSource(c);
            axios.put(`/api/documents/${s._id}`, s)
        }
        
    }

    const setInitialState = async () => {
        //@ts-ignore
        const convertFromRaw =  (await import('draft-js')).convertFromRaw
        const EditorState =  (await import('draft-js')).EditorState
        const ContentBlock =  (await import('draft-js')).ContentBlock
        if (selected) {
            if (selected.source) {
                const content = convertFromRaw(JSON.parse(selected.source))
                const editor = EditorState.createWithContent(content);
                setSource(editor)
                setContent(selected.source)
                console.log(selected.name)
            }
            else {
                setSource(EditorState.createEmpty())
                setContent('')
            }
            
            // setSource(EditorState.createEmpty())
        }
        
        // setSource(editorState.createWithContent(s))
    }

    useEffect(() => {
        // if (prevSelected) {
        //     save(prevSelected, prevContent)
        //     console.log(prevSelected.name)
        // }
        setInitialState();
    }, [selected])

    useEffect(() => {
        store.addEventListener('markdown-nav:save', save);
        return () => store.removeEventListener('markdown-nav:save', save);
    })


    return (
        <>
            { EditorComponent && source && 
                <EditorComponent 
                //@ts-ignore
                editorState={source}
                wrapperClassName="editor-wrapper"
                editorClassName="editor"
                onContentStateChange={edit}
                onEditorStateChange={setSource}
                toolbarClassName="toolbar"
            />
            }
        </>
    )
}

export default EditorWrapper