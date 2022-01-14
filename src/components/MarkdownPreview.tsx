import React, { useEffect, useState } from "react";

import { mdInit, updateResult, renderMathInElement } from "@/utils/render";
import useSWR from "swr";
import axios from "axios";
import { Document } from "~/models/Document";
import store from '@/store'
import { observer } from "mobx-react";

interface MarkdownPreviewProps {
    selected: Document;
}

const fetcher = (url: string) => axios.get(url).then(res => res.data);

const MarkdownPreview: React.FC<MarkdownPreviewProps> = observer(({ selected }) => {
    let container: HTMLElement | null = null;
    const source = store.fileTreeStore.selected?.code || '';
    const line = store.fileTreeStore.lineObj;
    let [hovering, setHovering] = useState(false);
    
    mdInit();

    const setPreview = (element: HTMLDivElement | null) => {
        if (element == null) return
        container = element
    }

    const renderToHTML = () => {
        if (container == null) return;
        const html = updateResult(source);
        container.innerHTML = html;
        renderMathInElement(container, {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                { left: '$', right: '$', display: false },
                {left: "\\begin{align}", right: "\\end{align}", display: true},
            ],
            macros: {
                "\\nl": "\\newline"
            },
            newLineInDisplayMode: true,
            output: "html",
            throwOnError: false
        })
    }

    const syncScroll: React.UIEventHandler<HTMLDivElement> = (event) => {
        if (!hovering) return
        let lines = document.querySelectorAll("[data-line]")
            for (let i = 0; i < lines.length; i++) {
                let l = lines[i] as HTMLElement;
                let n =  Number(l.dataset.line);
                if (l.offsetTop > container?.scrollTop!) {
                    store.fileTreeStore.setLine({
                        line: n,
                        src: 1
                    })
                    console.log(n)
                    return
                }
            }
    }

    useEffect(() => {
        renderToHTML();
    }, [source])

    useEffect(() => {
        if (line.src !== 1 && container !== null) {
            console.log(line.line)
            if (line.line === -1) {
                container.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
                return
            }
            if (line.line === -2) {
                container.scroll({
                    top: container.scrollHeight,
                    behavior: 'smooth'
                });
                return
            }
            let lines = document.querySelectorAll("[data-line]")
            for (let i = 0; i < lines.length; i++) {
                let l = lines[i] as HTMLElement;
                let n =  Number(l.dataset.line);
                if (n === line.line) {
                    container.scroll({
                        top: l.offsetTop,
                        behavior: 'smooth'
                    });
                    return
                }
                else if (n > line.line) {
                    if (i > 0) l = lines[i - 1] as HTMLElement
                    container.scroll({
                        top: l.offsetTop,
                        behavior: 'smooth'
                    });
                    return
                }
            }
            container.scroll({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [line])

    return (
        <div className="markdown-previewer" ref={setPreview} onScroll={syncScroll} 
            onMouseLeave={() => setHovering(false)} 
            onMouseEnter={() => setHovering(true)}>
        </div>
    )
})

export default MarkdownPreview
