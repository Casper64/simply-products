import { CSSProperties, FC, useCallback, useEffect } from 'react'
import useCodeMirror from '@/hooks/codemirror'
import styles from './Editor.module.scss'
import store from '@/store';
import cn from 'classnames'

export interface EditorProps {
    initialDoc: string;
    style?: CSSProperties;
    onChange: (doc: string) => void;
}

export const Editor: FC<EditorProps> = ({ initialDoc, onChange, style }) => {
    const handleChange = useCallback(
        state => onChange(state.doc.toString()),
        [onChange]
    )

    const [refContainer, editorView] = useCodeMirror<HTMLDivElement>({
        initialDoc,
        onChange: handleChange
    })

    useEffect(() => {
        if (editorView) {
            editorView.root.activeElement?.addEventListener('keyup', (e) => {
                if (store.fileTreeStore.selected) {
                    store.fileTreeStore.selected.changed = true;
                }
            });
        }
    }, [editorView])

    return <div className={cn(styles.editor, "markdown-editor")} style={style} ref={refContainer}></div>
}