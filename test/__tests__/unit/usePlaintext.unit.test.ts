import { renderHook } from '@testing-library/react-hooks'
import dedent from 'strip-indent'

import { usePlaintext } from '@/lib/utils/hooks/usePlaintext'

describe('usePlaintext', () => {
  it('should strip markdown formatting', async () => {
    const markdown = dedent(`
    This *is* a [marketplace](http://example.com) ~~dataset~~ publication.

    - one
    - two

    And an ![image](http://example.com/image.png).`)

    const { result, waitFor } = renderHook(() => {
      return usePlaintext({ markdown })
    })

    await waitFor(() => {
      return result.current.length > 0
    })

    expect(result.current).toMatchInlineSnapshot(
      `"This is a marketplace dataset publication. one two And an image."`,
    )
  })

  it('should not add escape characters to autolinks', async () => {
    const markdown = 'This *is* a link: http://example.com.'

    const { result, waitFor } = renderHook(() => {
      return usePlaintext({ markdown })
    })

    await waitFor(() => {
      return result.current.length > 0
    })

    expect(result.current).toMatchInlineSnapshot(`"This is a link: http://example.com."`)
  })
})
