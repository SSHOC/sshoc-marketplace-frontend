import { useEffect, useState } from 'react'
import markdown from 'remark-parse'
import stringify from 'remark-stringify'
import strip from 'strip-markdown'
import unified from 'unified'
import { truncate } from '../../utils'

const processor = unified()
  .use(markdown)
  .use(strip)
  .use(stringify)

const PlainText = ({ children, maxLength }) => {
  // FIXME: check if rendering sync w/ processor.processSync is less jumpy
  const [plainText, setPlainText] = useState(null)

  useEffect(() => {
    processor.process(children).then(processed => {
      if (maxLength) {
        setPlainText(truncate(String(processed), { length: maxLength }))
      } else {
        setPlainText(String(processed))
      }
    })
  }, [children, maxLength])

  return plainText
}

export default PlainText
