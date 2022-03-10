import Head from 'next/head'

import { createUrl } from '@/data/sshoc/lib/client'

export function PreloadData(): JSX.Element {
  return (
    <Head>
      <link
        rel="preload"
        as="fetch"
        href={String(createUrl({ pathname: '/api/items-categories' }))}
        crossOrigin="anonymous"
        type="application/json"
      />
    </Head>
  )
}
