import { observer } from 'mobx-react'
import dynamic from 'next/dynamic';
import React, { ComponentType, useEffect, useState } from 'react'
import type { EditorProps } from 'react-draft-wysiwyg';
import { Document } from '~/models/Document'
import store from '@/store'
import axios from 'axios';
import type { ContentBlock, EditorState } from 'draft-js';

let EditorComponent: ComponentType<EditorProps>;

interface EditorWrapperProps {
    selected: Document;
}

const EditorWrapper: React.FC<EditorWrapperProps> = ({ selected }) => {
    //@ts-ignore
    const [source, setSource] = useState(null as any);
    const [content, setContent] = useState('');
    EditorComponent = dynamic(async () => (await import('react-draft-wysiwyg')).Editor, { ssr: false })

    const edit = (state: Draft.DraftModel.Encoding.RawDraftContentState) => {
        setContent(JSON.stringify(state));
    }

    const save = () => {
    if (content.length != 0) {
            store.fileTreeStore.setSource(content);
            axios.put(`/api/documents/${selected._id}`, selected)
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
            }
            else {
                setSource(EditorState.createEmpty())
            }
            
            // setSource(EditorState.createEmpty())
        }
        
        // setSource(editorState.createWithContent(s))
    }

    useEffect(() => {
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
            />
            }
        </>
    )
}

export default EditorWrapper