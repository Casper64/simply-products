import { useMobile } from "@/hooks/isMobile";
import store from "@/store";
import axios from "axios";
import { observable } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useRef, useState } from "react";
import { Document } from "~/models/Document";

interface markdownEditorProps {
    selected: Document;
    preview?: boolean;
    onChange?: any;
}

const MarkdownEditor: React.FC<markdownEditorProps> = observer(({ selected, preview, onChange }) => {
    const [typed, setTyped] = useState(false);
    const [lastTyped, setLastTyped] = useState(0);
    const [source, setSource] = useState(selected.code);
    let textArea = useRef(null) as React.MutableRefObject<null | HTMLTextAreaElement>;
    let container = useRef(null) as React.MutableRefObject<null | HTMLDivElement>;
    const lineHeight = 25;
    const line = store.fileTreeStore.lineObj;
    let [hovering, setHovering] = useState(false);
    const { mobile } = useMobile();

    const keyUp: React.KeyboardEventHandler<HTMLTextAreaElement> =  () => {
        if (!typed){
            setTyped(true);
            setLastTyped(Date.now());
        }
    }

    const interval = () => {
        if (typed && lastTyped != 0 && Date.now()-lastTyped >= 500) {
            setTyped(false);
            setLastTyped(0);
            if (!preview) {
                store.fileTreeStore.setCode(textArea.current?.value || '')
                axios.put(`/api/documents/${selected._id}`, selected)
            }
            else {
                onChange({...selected, code: textArea.current?.value || ''})
            }
        }
    }

    useEffect(() => {
        const int = setInterval(interval, 500);
        return () => clearInterval(int);
    }, [typed, lastTyped, interval]);
    useEffect(() => {
         if (selected) {
            setSource(selected.code);
        }
    }, [selected]);
    useEffect(() => {
	
        if (textArea.current == null) return;
        textArea.current.style.height = "unset";
        const scrollHeight = textArea.current.scrollHeight;
        textArea.current.style.height = scrollHeight + "px";
        if (mobile || (mobile && preview)) {
            //@ts-ignore
            textArea.current.parentElement.style.height = scrollHeight + "px";
        }
        
	
    }, [source, textArea])

    const handleTab: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
        if (event.key !== "Tab" || textArea.current == null) {
            return
        }
        event.stopPropagation();
        event.preventDefault();
        let start = textArea.current.selectionStart;
        let end = textArea.current.selectionEnd;

        // Insert tab
        setSource(source.substring(0, start) + "    " + source.substring(end));

        start = end = start + 4;
    }

    const changeSource = (e: any) => {
        //@ts-ignore
        setSource(e.target.value);
    }

    const getLineNumbers = () => {
        let height = Number(textArea.current?.clientHeight);
        if (!height) return '';
        height = Math.floor(height / lineHeight)
        let el = new Array(height).fill(0).map((_, line) => {
            return <p key={'line-'+line}>{ (line+1) }</p>
        });
        return el;
    }

    const syncScroll: React.UIEventHandler<HTMLDivElement> = (event) => {
        if (!hovering) return
        // 20 is the padding
        const line = Math.floor((container.current?.scrollTop! - 20) / lineHeight);

        // Expand line to be precise: https://stackoverflow.com/questions/3697096/finding-number-of-lines-in-an-html-textarea?rq=1
        // $.each(lines, function(i, v) {
        //     // Calculate width of line
        //     lineWidth = ((v.length + 1) * averageWidth) + missingWidth;
        //     // Check if the line is wrapped
        //     if (lineWidth >= ta.outerWidth()) {
        //       // Calculate number of times the line wraps
        //       var wrapCount = Math.floor(lineWidth / ta.outerWidth());
        //       wrappingCount += wrapCount;
        //       wrappingLines++;
        //     }
      
        //     if ($.trim(v) === "") {
        //       blankLines++;
        //     }
        //   });

        const max = Math.floor((container.current?.scrollHeight! - container.current?.clientHeight! - 20) / lineHeight)
        if (line === max) store.fileTreeStore.setLine({line: -2, src: 0})
        else store.fileTreeStore.setLine({line, src: 0})
    }

    useEffect(() => {
        if (line.src === 1) {
            container.current?.scroll({
                top: (line.line - 2)*lineHeight,
                behavior: 'smooth'
            })
        }
    }, [line])

    return (
        <div className="markdown-editor" ref={container}  
            onScroll={syncScroll} 
            onMouseLeave={() => setHovering(false)} 
            onMouseEnter={() => setHovering(true)}
        >
            <div className="line-numbers">
                { getLineNumbers() }
            </div>
            <textarea ref={textArea} value={source} onKeyUp={keyUp} spellCheck={false}
                onChange={changeSource} onPaste={changeSource} onKeyDown={handleTab}></textarea>
        </div>
    )

    
})

export default MarkdownEditor
