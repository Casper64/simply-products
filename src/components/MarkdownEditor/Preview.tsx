import React, { CSSProperties, Fragment } from 'react'
import ReactMarkdown from 'react-markdown'
import RemarkCode from './remarkCode'
import { defaultSchema } from 'hast-util-sanitize'

import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
//@ts-ignore
import imgLinks from "@pondorasti/remark-img-links"
import remarkGemoji from 'remark-gemoji'

interface Props {
  doc: string
  style: CSSProperties;
}

const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code || []), 'className']
  }
}

const Preview: React.FC<Props> = (props) => {

  let newDoc = props.doc.replaceAll(/```math(\s.+)```/gs, "$$$ $1 $$$")
  newDoc = newDoc.replaceAll(/```math\S(.+)```/gs, "```math $1```")

  return (
    <div className="preview markdown-body" style={props.style}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, [imgLinks, { absolutePath: "https://www.google.com/" }], remarkGemoji]}
        rehypePlugins={[[rehypeKatex, {
          newLineInDisplayMode: true
        }]]}

        
        linkTarget="_blank"
        
        components={{
          //@ts-expect-error
          code: RemarkCode
        }}
      >{ newDoc }</ReactMarkdown>
    </div>
  )
}

export default Preview