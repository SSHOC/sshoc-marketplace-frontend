import type { Toc } from '@stefanprobst/remark-extract-toc'
import withToc from '@stefanprobst/remark-extract-toc'
import { promises as fs } from 'fs'
import type { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import * as path from 'path'
import type { ParsedUrlQuery } from 'querystring'
import withRawHtml from 'rehype-raw'
import toHtml from 'rehype-stringify'
import withGfm from 'remark-gfm'
import fromMarkdown from 'remark-parse'
import toHast from 'remark-rehype'
import withHeadingIds from 'remark-slug'
import { toVFile } from 'to-vfile'
import { unified } from 'unified'
import { matter } from 'vfile-matter'

import { getLastUpdatedTimestamp } from '@/api/git'
import ContributeScreen from '@/screens/contribute/ContributeScreen'

interface Frontmatter {
  title: string
  menu: string
  ord: number
  toc: boolean
}

interface PageParams extends ParsedUrlQuery {
  id: string
}

export interface PageProps {
  lastUpdatedAt: string
  html: string
  metadata: { title: string; menu: string; ord: number; toc: Toc }
  id: string
  pages: Array<{ pathname: string; label: string; menu: string }>
}

export default function ContributePage(props: PageProps): JSX.Element {
  return <ContributeScreen {...props} />
}

const extension = '.mdx'
const folder = path.join(process.cwd(), 'content', 'contribute-pages')
const processor = unified()
  .use(fromMarkdown)
  .use(withGfm)
  .use(withHeadingIds)
  .use(withToc)
  .use(toHast, { allowDangerousHtml: true })
  .use(withRawHtml)
  .use(toHtml)

export async function getStaticPaths(): Promise<GetStaticPathsResult<PageParams>> {
  const ids = await getContributePageIds()

  const paths = ids.map((id) => {
    return { params: { id } }
  })

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps(
  context: GetStaticPropsContext<PageParams>,
): Promise<GetStaticPropsResult<PageProps>> {
  const params = context.params as PageParams
  const id = params.id

  let lastUpdatedAt
  try {
    lastUpdatedAt = (await getLastUpdatedTimestamp(id)).toISOString()
  } catch {
    lastUpdatedAt = new Date().toISOString()
  }

  const { metadata, html } = await getContributePageById(id)

  const pages = await getContributePageRoutes()

  return {
    props: {
      lastUpdatedAt,
      html,
      metadata,
      id,
      pages,
    },
  }
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

async function getContributePageById(id: string) {
  const vfile = await processor.process(await getContributePageMetadataById(id))
  const frontmatter = vfile.data.matter as Frontmatter
  const toc = (vfile.data.toc ?? []) as Toc
  const html = String(vfile)

  const metadata = { ...frontmatter, toc: frontmatter.toc === true ? toc : [] }

  return { metadata, html }
}

async function getContributePageMetadataById(id: string) {
  const filePath = path.join(folder, id + extension)
  const vfile = await toVFile.read(filePath)
  return matter(vfile, { strip: true })
}

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
