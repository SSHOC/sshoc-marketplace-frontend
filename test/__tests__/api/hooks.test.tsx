import { describe, expect, it } from '@jest/globals'
import { renderHook } from '@testing-library/react-hooks'
import { rest } from 'msw'

import { useItemSearch } from '@/data/sshoc/hooks/item'
import { server } from '@/data/sshoc/mocks/server'
import { createWrapper } from '~/test/lib/render'

describe('api hooks', () => {
  it('should return result', async () => {
    const { result, waitFor } = renderHook(
      () => {
        return useItemSearch({})
      },
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      return result.current.isSuccess
    })

    expect(result.current.data).toBeDefined()
  })

  it('should return error', async () => {
    server.use(
      rest.get('*', (request, response, context) => {
        return response(context.status(500))
      }),
    )

    const { result, waitFor } = renderHook(
      () => {
        return useItemSearch({})
      },
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      return result.current.isError
    })

    expect(result.current.error).toBeDefined()
  })
})
