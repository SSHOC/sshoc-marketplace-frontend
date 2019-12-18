import markdown from 'remark-parse'
import stringify from 'remark-stringify'
import strip from 'strip-markdown'
import unified from 'unified'
import { truncate } from '../../utils'

const processor = unified()
  .use(markdown)
  .use(strip)
  .use(stringify)

// TODO: should we cache plaintext and rendered markdown descriptions in redux
// (and possibly immediately process them on fetch)?
const PlainText = ({ children, maxLength }) => {
  const plainText = String(processor.processSync(children))

  return maxLength ? truncate(plainText, { length: maxLength }) : plainText
}

export default PlainText
