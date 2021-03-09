declare module '*.mdx' {
  import type { FC } from 'react'

  const metadata: { [key: string]: unknown }
  const MDXComponent: FC<unknown>
  export { metadata }
  export default MDXComponent
}
