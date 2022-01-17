import React from 'react'
import UseSVG from '@/components/ui/UseSvg'
import store from '@/store'

import Image from 'assets/image.svg'
import Save from 'assets/save.svg'
import Code from 'assets/code.svg'
import Document from 'assets/document.svg'
import Download from 'assets/download.svg'
import axios from 'axios'
import { observer } from 'mobx-react'
import { useMobile } from '@/hooks/isMobile'

const ProjectNav: React.FC = observer(() => {
    const selected = store.fileTreeStore.selected;
    const { mobile } = useMobile();

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
            { !mobile && <div className="nav-item layout-split" title="layout split"
                onClick={() => store.dispatchEvent('editor-layout', 'split')}>
                <UseSVG xlinkHref={Code.src}/>
                <div className="border"></div>
                <UseSVG xlinkHref={Document.src}/>
            </div> }
            <div className="spacer"></div>
            <div className="nav-item layout-single" title="download"
                onClick={download}>
                <UseSVG xlinkHref={Download.src}/>
            </div>
        </nav>
    )
})

export default ProjectNav