import { assert } from '@stefanprobst/assert'
import type { RequestOptions } from '@stefanprobst/request'
import { createUrl, request } from '@stefanprobst/request'
import type { FormEvent, ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { Prose } from '@/components/common/Prose'
import css from '@/components/documentation/ApiEndpoint.module.css'
import { ApiParamsProvider } from '@/components/documentation/ApiParamsContext'
import { Button } from '@/lib/core/ui/Button/Button'
import { Icon } from '@/lib/core/ui/Icon/Icon'
import CheckMarkIcon from '@/lib/core/ui/icons/checkmark.svg?symbol-icon'
import ClipboardIcon from '@/lib/core/ui/icons/clipboard.svg?symbol-icon'
import { ProgressSpinner } from '@/lib/core/ui/ProgressSpinner/ProgressSpinner'
import { baseUrl } from '~/config/sshoc.config'

export type ApiParams = Record<string, Array<number | string> | number | string>

export interface ApiEndpointProps {
  children?: ReactNode
  endpoint: {
    key: string
    pathname: string
    initialParams?: ApiParams
  }
  title: ReactNode
}

export function ApiEndpoint(props: ApiEndpointProps): JSX.Element {
  const { children, endpoint, title } = props

  /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */
  assert(endpoint.key != null && endpoint.pathname != null, 'Please provide endpoint config.')

  const [params, setParams] = useState(endpoint.initialParams ?? {})
  const url = useMemo(() => {
    return createUrl({ pathname: endpoint.pathname, baseUrl, searchParams: params })
  }, [endpoint, params])

  const result = useQuery(
    ['documentation', endpoint.key, params],
    () => {
      const options: RequestOptions = { responseType: 'json' }

      return request(url, options)
    },
    { enabled: false, keepPreviousData: true },
  )

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    result.refetch()
    event.preventDefault()
  }

  const [isCopiedToClipboard, setCopiedToClipboard] = useState(false)

  function onCopy() {
    navigator.clipboard.writeText(String(url))
    setCopiedToClipboard(true)
  }

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null

    if (isCopiedToClipboard === true) {
      timer = setTimeout(() => {
        setCopiedToClipboard(false)
        timer = null
      }, 2000)
    }

    return () => {
      if (timer != null) {
        clearTimeout(timer)
      }
    }
  }, [isCopiedToClipboard])

  return (
    <aside className={css['container']}>
      <strong className={css['title']}>{title}</strong>
      <form className={css['controls']} noValidate onSubmit={onSubmit}>
        <div className={css['controls-left']}>
          <ApiParamsProvider value={{ params, setParams }}>{children}</ApiParamsProvider>
        </div>
        <div className={css['controls-right']}>
          {result.isFetching ? <ProgressSpinner size="sm" /> : null}
          <Button color="secondary" size="xs" type="submit">
            Refresh
          </Button>
        </div>
      </form>
      <div className={css['url']}>
        <pre>{String(url)}</pre>
        <button
          type='button'
          aria-label="Copy to clipboard"
          onClick={onCopy}
          title={isCopiedToClipboard ? 'Copied' : 'Copy to clipboard'}
        >
          {isCopiedToClipboard ? <Icon icon={CheckMarkIcon} /> : <Icon icon={ClipboardIcon} />}
        </button>
      </div>
      <div className={css['result']}>
        {result.data != null ? (
          <Prose>
            <pre>
              <code>{JSON.stringify(result.data, null, 2)}</code>
            </pre>
          </Prose>
        ) : null}
      </div>
    </aside>
  )
}
