import { renderHook } from '@testing-library/react-hooks'
import dedent from 'strip-indent'

import { useMarkdown } from '@/lib/utils/hooks/useMarkdown'

describe('useMarkdown', () => {
  it('should transform markdown to React elements', async () => {
    const markdown = dedent(`
    This *is* a [marketplace](http://example.com) ~~dataset~~ publication.

    - one
    - two

    And an ![image](http://example.com/image.png).`)

    const { result, waitFor } = renderHook(() => {
      return useMarkdown({ markdown })
    })

    await waitFor(() => {
      return result.current != null
    })

    expect(result.current).toMatchInlineSnapshot(`
      <React.Fragment>
        <p>
          This 
          <em>
            is
          </em>
           a 
          <a
            href="http://example.com"
          >
            marketplace
          </a>
           
          <del>
            dataset
          </del>
           publication.
        </p>
        

        <ul>
          

          <li>
            one
          </li>
          

          <li>
            two
          </li>
          

        </ul>
        

        <p>
          And an 
          <img
            alt="image"
            src="http://example.com/image.png"
          />
          .
        </p>
      </React.Fragment>
    `)
  })
})
