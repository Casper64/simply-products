import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0'
import Image from 'next/image'
import { Document } from '~/models/Document'
import MacWindow from '@/components/MacWindow'
import store from '@/store'
import { observer } from 'mobx-react'
import { NoteEditor } from '@/components/MarkdownEditor'
import { useMobile } from '@/hooks/isMobile'
import { Editor } from '@/components/MarkdownEditor/Editor'
import Preview from '@/components/MarkdownEditor/Preview'

const IndexPage: React.FC = observer(() => {
    const { user } = useUser();
    const s1 = useRef(null) as React.MutableRefObject<null | HTMLParagraphElement>
    const s2 = useRef(null) as React.MutableRefObject<null | HTMLParagraphElement>
    const t1 = useRef(null) as React.MutableRefObject<null | HTMLDivElement>
    const t2 = useRef(null) as React.MutableRefObject<null | HTMLDivElement>
    const initialDoc =  "# Hello world\n\nYou can edit me...";
    const [example, setExample] = useState({code: initialDoc, parent: '', folder: false, owner: ''} as Document);
    const { mobile } = useMobile();
    store.fileTreeStore.selected = null;

    const scrolling = (event: any) => {
        if (mobile) return
        let el = document.querySelector('html');
        //@ts-ignore
        let percentage = (el?.scrollTop % window.innerHeight) / window.innerHeight;
        if (s1.current) s1.current.style.transform = `translateY(-${percentage*100}%)`
        if (s2.current) s2.current.style.transform = `translateY(${percentage*100}%)`
        if (t1.current) t1.current.style.transform = `translateY(${0.8 * el!.scrollTop}px)`
        if (t2.current) t2.current.style.transform = `translateY(-${percentage*100}%)`
    }

    useEffect(() => {
        document.addEventListener('scroll', scrolling);
        return () => document.removeEventListener('scroll', scrolling)
    })

    const changeDoc = (doc: string) => {
        setExample({...example, code: doc} as Document)
    }


    return (
        <div className="index-page" >
            <div className="landing">
                <div className="top"></div>
                <div className="left side-container">
                    <div className="text-container" ref={t1}>
                        <h1>Simply Notes</h1>
                        <h2>Make and export notes easily</h2>
                        <Link href={user ? '/dashboard':'/api/auth/login?returnTo=%2Fdashboard'} passHref>
                            <p className="action-link">
                                Get <span className="spacer"> </span>Started
                            </p>
                        </Link>
                    </div>
                    { !mobile && <div className="markdown-edit-preview" ref={t2}>
                        <MacWindow darkMode={store.darkMode}>
                            <Editor style={{display: 'grid'}} onChange={changeDoc} initialDoc={initialDoc}/>
                        </MacWindow>
                    </div> }
                    <div className="s-logo"><p  ref={s1}>S</p></div>
                </div>
                <div className="right side-container">
                    <div className="s-logo"><p  ref={s2}>S</p></div>
                    { !mobile && <div className="markdown-preview">
                        <MacWindow darkMode={store.darkMode}>
                            <Preview style={{display: 'grid'}} doc={example.code}/>
                        </MacWindow>
                    </div> }
                    <div className="text-container">
                        <h1>Markdown &amp; Latex</h1>
                        <h2>Use markdown and Latex&#39;s math syntax</h2>
                        <Link href={user ? '/dashboard':'/api/auth/login?returnTo=%2Fdashboard'} passHref>
                            <p className="action-link">
                                Get <span className="spacer"> </span>Started
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="landing-preview">
                <div className="right-text">
                    <h3>Try it</h3>
                </div>
                <div className="container">
                    <div className="markdown-edit-preview preview" >
                        <MacWindow darkMode={store.darkMode}>
                            <Editor style={{display: 'grid'}} onChange={changeDoc} initialDoc={initialDoc}/>
                        </MacWindow>
                    </div> 
                    <div className="markdown-preview preview">
                        <MacWindow darkMode={store.darkMode}>
                            <Preview style={{display: 'grid'}} doc={example.code}/>
                        </MacWindow>
                    </div>
                </div>
                
            </div>
        </div>
    )
})

export default IndexPage