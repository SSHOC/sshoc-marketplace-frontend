import type { ValLoaderResult } from '@stefanprobst/val-loader'
import { promises as fs } from 'fs'
import * as path from 'path'

interface Frontmatter {
  title: string
  menu: string
  ord: number
  toc: boolean
}

const extension = '.mdx'
const folder = path.join(process.cwd(), 'content', 'about-pages')

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

export default async function load(): Promise<ValLoaderResult> {
  /** `val-loader` currently does not support ESM. */
  const { toVFile } = await import('to-vfile')
  const { matter } = await import('vfile-matter')

  async function getAboutPageRoutes() {
    const ids = await getAboutPageIds()
    const pages = await Promise.all(
      ids.map(async (id) => {
        const vfile = await getAboutPageMetadataById(id)
        const frontmatter = vfile.data.matter as Frontmatter
        return {
          pathname: `/about/${id}`,
          label: frontmatter.title,
          menu: frontmatter.menu,
          position: frontmatter.ord,
        }
      }),
    )

    pages.sort((a, b) => {
      return a.position > b.position ? 1 : -1
    })

    return pages
  }

  async function getAboutPageMetadataById(id: string) {
    const filePath = path.join(folder, id + extension)
    const vfile = await toVFile.read(filePath)
    return matter(vfile, { strip: true })
  }

  const pages = await getAboutPageRoutes()

  return { cacheable: true, code: `export default ${JSON.stringify(pages)}` }
}
