import { promises as fs } from 'fs'
import matter from 'gray-matter'
import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import * as path from 'path'
import type { ParsedUrlQuery } from 'querystring'
import toHtml from 'rehype-stringify'
import fromMarkdown from 'remark-parse'
import toHast from 'remark-rehype'
import unified from 'unified'

import { getLastUpdatedTimestamp } from '@/api/git'
import ContributeScreen from '@/screens/contribute/ContributeScreen'

interface PageParams extends ParsedUrlQuery {
  id: string
}

export interface PageProps {
  lastUpdatedAt: string
  html: string
  metadata: { title: string }
  id: string
  pages: Array<{ pathname: string; label: string }>
}

export default function ContributePage(props: PageProps): JSX.Element {
  return <ContributeScreen {...props} />
}

const extension = '.mdx'
const folder = path.join(process.cwd(), 'content', 'contribute-pages')
const processor = unified().use(fromMarkdown).use(toHast).use(toHtml)

export async function getStaticPaths(): Promise<
  GetStaticPathsResult<PageParams>
> {
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
  const { data, content } = await getContributePageMetadataById(id)
  const html = String(await processor.process(content))

  return {
    metadata: data as { title: string },
    html,
  }
}

async function getContributePageMetadataById(id: string) {
  const filePath = path.join(folder, id + extension)
  return matter(await fs.readFile(filePath, 'utf-8'))
}

async function getContributePageRoutes() {
  const ids = await getContributePageIds()
  return Promise.all(
    ids.map(async (id) => {
      const { data } = await getContributePageMetadataById(id)
      return { pathname: `/contribute/${id}`, label: data.title }
    }),
  )
}
