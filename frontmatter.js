/* eslint-disable */
// @ts-ignore
const matter = require('gray-matter')

module.exports = function frontmatter(source) {
  const callback = this.async()
  const { content, data } = matter(source)
  const code = `export const metadata = ${JSON.stringify(data)};\n\n${content}`
  return callback(null, code)
}
