import { promises as fs } from 'fs'
import matter from 'gray-matter'
import preval from 'next-plugin-preval'
import * as path from 'path'

const extension = '.mdx'
const folder = path.join(process.cwd(), 'content', 'about-pages')

/**
 * There is currently not good mechanism in Next.js to statically provide
 * async data to all pages (e.g. via getStaticProps in pages/_app.tsx).
 * So we preval at build time to generate json data which can be imported.
 */
async function getAboutPageRoutes() {
  const ids = await getAboutPageIds()
  const pages = await Promise.all(
    ids.map(async (id) => {
      const { data } = await getAboutPageMetadataById(id)
      return {
        pathname: `/about/${id}`,
        label: data.title,
        menu: data.menu,
        position: data.ord,
      }
    }),
  )

  pages.sort((a, b) => {
    return a.position > b.position ? 1 : -1
  })

  return pages
}

async function getAboutPageIds() {
  try {
    const ids = (await fs.readdir(folder, 'utf-8')).map((fileName) => {
      return fileName.slice(0, -extension.length)
    })
    return ids
  } catch {
    return []
  }
}

async function getAboutPageMetadataById(id: string) {
  const filePath = path.join(folder, id + extension)
  return matter(await fs.readFile(filePath, 'utf-8'))
}

export default preval(getAboutPageRoutes())
