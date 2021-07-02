import { promises as fs } from 'fs'
import matter from 'gray-matter'
import preval from 'next-plugin-preval'
import * as path from 'path'

const extension = '.mdx'
const folder = path.join(process.cwd(), 'content', 'contribute-pages')

/**
 * There is currently not good mechanism in Next.js to statically provider
 * async data to all pages (e.g. via getStaticProps in pages/_app.tsx).
 * So we preval at build time to generate json data which can be imported.
 */
async function getContributePageRoutes() {
  const ids = await getContributePageIds()
  return Promise.all(
    ids.map(async (id) => {
      const { data } = await getContributePageMetadataById(id)
      return { pathname: `/contribute/${id}`, label: data.title }
    }),
  )
}

async function getContributePageIds() {
  const ids = (await fs.readdir(folder, 'utf-8')).map((fileName) => {
    return fileName.slice(0, -extension.length)
  })
  return ids
}

async function getContributePageMetadataById(id: string) {
  const filePath = path.join(folder, id + extension)
  return matter(await fs.readFile(filePath, 'utf-8'))
}

export default preval(getContributePageRoutes())
