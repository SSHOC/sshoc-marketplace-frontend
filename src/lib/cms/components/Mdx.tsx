import type { ReactNode } from 'react'
import { Fragment, useEffect, useState } from 'react'

export interface MdxProps {
  mdx: string
}

export function Mdx(props: MdxProps): JSX.Element {
  const { mdx } = props

  const [element, setElement] = useState<ReactNode>(null)

  useEffect(() => {
    let isCanceled = false

    async function run() {
      const { createProcessor } = await import('@/lib/cms/components/create-processor')

      const processor = await createProcessor()
      const vfile = await processor.process(mdx)

      if (!isCanceled) {
        setElement(vfile.result)
      }
    }

    run()

    return () => {
      isCanceled = true
    }
  }, [mdx])

  return <Fragment>{element}</Fragment>
}
