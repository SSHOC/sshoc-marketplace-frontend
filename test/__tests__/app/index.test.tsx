/**
 * @jest-environment jsdom
 */

// import { describe, it, expect } from '@jest/globals'
import { screen } from '@testing-library/react'
import { rest } from 'msw'

import { server } from '@/data/sshoc/mocks/server'
import { dictionary as common } from '@/dictionaries/common/en'
import HomePageComponent from '@/pages/index.page'
import { renderWithProviders } from '~/test/lib/render'

const dictionaries = {
  common,
}

describe('Home', () => {
  it('renders a heading', () => {
    renderWithProviders(<HomePageComponent dictionaries={dictionaries} />)

    const heading = screen.getByRole('heading', {
      name: /sshoc marketplace/i,
    })

    expect(heading).toBeInTheDocument()
  })
})

describe('query component', () => {
  it('successful query component', async () => {
    renderWithProviders(<HomePageComponent dictionaries={dictionaries} />)

    expect(await screen.findByText(/browse by/i)).toBeInTheDocument()
  })

  it('failure query component', async () => {
    server.use(
      rest.get('*', (request, response, context) => {
        return response(context.status(500))
      }),
    )

    renderWithProviders(<HomePageComponent dictionaries={dictionaries} />)

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
  })
})
