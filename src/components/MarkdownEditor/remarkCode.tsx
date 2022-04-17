import React, { useEffect, useState } from 'react'
import runmode, { getLanguage } from './runmode'

type Tokens = {
  text: string,
  style: string | null
}[]

const RemarkCode: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
> = props => {
  const [spans, setSpans] = useState<Tokens>([])
  const { className } = props
  const langName = (className || '').substr(9)
  // Add counter to keep track of how many times the component is updated
  const [counter, setCounter] = useState(0);


  useEffect(() => {
    getLanguage(langName).then((language: any) => {
      if (language) {
        const body = props.children instanceof Array ? props.children[0] : null
        const tokens: Tokens = []
        runmode(
          body as string,
          language,
          (text: string, style: string | null, _from: number, _to: number) => {
            tokens.push({ text, style })
          }
        )
        setSpans(tokens)
      }
    })

    return () => {
      // If the current counter is different than the counter value we store an update to the component must have occur
      // So we can disregard this update, because it will now update an unmounted component
      // EDIT: that was the idea, but idk why but adding the setter in the return of useEffect makes it not leak memory??
      setCounter(counter+1)
    }
  }, [props.children])


  if (spans.length > 0) {
    return (
      <code>
        {spans.map((span, i) => (
          <span key={i} className={span.style || ''}>
            {span.text}
          </span>
        ))}
      </code>
    )
  } else {

    return <code>{props.children}</code>
  }
}

export default RemarkCode