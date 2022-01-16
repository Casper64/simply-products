import React from 'react'
import UseSVG from '@/components/UseSvg'
import store from '@/store'

import Image from 'assets/image.svg'
import Save from 'assets/save.svg'
import Code from 'assets/code.svg'
import Document from 'assets/document.svg'
import Download from 'assets/download.svg'
import axios from 'axios'
import { observer } from 'mobx-react'

function base64ToArrayBuffer(base64: string) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
       var ascii = binaryString.charCodeAt(i);
       bytes[i] = ascii;
    }
    return bytes;
 }

function saveByteArray(reportName: string, byte: any) {
    var blob = new Blob([byte], {type: "application/pdf"});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
};

const ProjectNav: React.FC = observer(() => {
    const selected = store.fileTreeStore.selected;

    const download = async () => {
        if (!selected) return
        let el = document.querySelector('.markdown-previewer')!;
        if (!el) return;
        let html = el.innerHTML;

        const { data } = await axios.post('/api/download', {code: html});
        const element = document.createElement('a');
        element.href = data;
        element.download = `${selected.name}.pdf`
        document.body.append(element);
        element.click();
        element.remove();
        // saveByteArray(selected.name+'.pdf', data)
        // const urlString = `data:application/pdf;base64,${btoa(unescape(encodeURIComponent(data)))}`;
        
    }

    return (
        <nav className="markdown-nav">
            <div className="nav-item layout-single" title="images" 
                onClick={() => store.dispatchEvent('markdown-nav:images')}>
                <UseSVG xlinkHref={Image.src}/>
            </div>
            <div className="spacer"></div>
            {/* <div className="nav-item layout-single" title="save"
                onClick={() => store.dispatchEvent('markdown-nav:images')}>
                <UseSVG xlinkHref={Save.src}/>
            </div> */}
            <div className="nav-item layout-single" title="layout code"
                onClick={() => store.dispatchEvent('editor-layout', 'code')}>
                <UseSVG xlinkHref={Code.src}/>
            </div>
            <div className="nav-item layout-single" title="layout preview"
                onClick={() => store.dispatchEvent('editor-layout', 'preview')}>
                <UseSVG xlinkHref={Document.src}/>
            </div>
            <div className="nav-item layout-split" title="layout split"
                onClick={() => store.dispatchEvent('editor-layout', 'split')}>
                <UseSVG xlinkHref={Code.src}/>
                <div className="border"></div>
                <UseSVG xlinkHref={Document.src}/>
            </div>
            <div className="spacer"></div>
            <div className="nav-item layout-single" title="download"
                onClick={download}>
                <UseSVG xlinkHref={Download.src}/>
            </div>
        </nav>
    )
})

export default ProjectNav