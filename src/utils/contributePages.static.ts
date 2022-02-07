import type { ValLoaderResult } from '@stefanprobst/val-loader'
import { promises as fs } from 'fs'
import * as path from 'path'

const extension = '.mdx'
const folder = path.join(process.cwd(), 'content', 'contribute-pages')

interface Frontmatter {
  title: string
  menu: string
  ord: number
  toc: boolean
}

async function getContributePageIds() {
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

  async function getContributePageRoutes() {
    const ids = await getContributePageIds()
    const pages = await Promise.all(
      ids.map(async (id) => {
        const vfile = await getContributePageMetadataById(id)
        const frontmatter = vfile.data.matter as Frontmatter
        return {
          pathname: `/contribute/${id}`,
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

  async function getContributePageMetadataById(id: string) {
    const filePath = path.join(folder, id + extension)
    const vfile = await toVFile.read(filePath)
    return matter(vfile, { strip: true })
  }

  const pages = await getContributePageRoutes()

  return { cacheable: true, code: `export default ${JSON.stringify(pages)}` }
}
