import { renderHook } from '@testing-library/react-hooks'

import { useItemDiffFormInitialValues } from '@/components/item-form/useItemDiffFormInitialValues'

describe('useItemDiffFormInitialValues', () => {
  it('should return item unmodified when diff is equal', async () => {
    const diff = {
      // current item
      item: {
        persistentId: '123',
        id: 123,
        label: 'The label',
        description: 'The description',
      },
      equal: true,
      // diff data
      other: {
        label: 'The label',
        description: 'The description',
      },
    }

    // suggested item
    const initialValues = {
      persistentId: '123',
      id: 456,
      label: 'The label',
      description: 'The description',
    }

    const { result, waitFor } = renderHook(() => {
      return useItemDiffFormInitialValues({ diff, item: initialValues })
    })

    await waitFor(() => {
      return result.current != null
    })

    expect(result.current).toBe(initialValues)
  })

  it('should add empty values for deleted array items', async () => {
    const diff = {
      // current item
      item: {
        label: 'The label',
        description: 'The description',
        accessibleAt: ['http://example.com'],
        externalIds: [{ identifier: '123', identifierService: { code: '123' } }],
        contributors: [{ role: { code: '123' }, actor: { id: 123 } }],
        properties: [{ type: { type: 'string', code: '123' }, value: '123' }],
        media: [{ info: { mediaId: '123' } }],
      },
      equal: false,
      // diff data
      other: {
        label: 'The label',
        description: 'The description',
        accessibleAt: [],
        externalIds: [],
        contributors: [],
        properties: [],
        media: [],
      },
    }

    // suggested item
    const item = {
      label: 'The label',
      description: 'The description',
      accessibleAt: [],
      externalIds: [],
      contributors: [],
      properties: [],
      media: [],
    }

    const { result, waitFor } = renderHook(() => {
      return useItemDiffFormInitialValues({ diff, item })
    })

    await waitFor(() => {
      return result.current != null
    })

    expect(result.current).toEqual({
      label: 'The label',
      description: 'The description',
      accessibleAt: [undefined],
      externalIds: [undefined],
      contributors: [undefined],
      properties: [undefined],
      media: [undefined],
    })
  })

  it.skip('should add empty object for deleted workflow steps', async () => {
    const diff = {
      // current item
      item: {
        // FIXME: steps not currently included in backend response
        composedOf: [
          {
            label: 'The label',
            description: 'The description',
            accessibleAt: ['http://example.com'],
            externalIds: [{ identifier: '123', identifierService: { code: '123' } }],
            contributors: [{ role: { code: '123' }, actor: { id: 123 } }],
            properties: [{ type: { type: 'string', code: '123' }, value: '123' }],
            media: [{ info: { mediaId: '123' } }],
          },
        ],
      },
      equal: false,
      // diff data
      other: {
        composedOf: [],
      },
    }

    // suggested item
    const item = {
      composedOf: [],
    }

    const { result, waitFor } = renderHook(() => {
      return useItemDiffFormInitialValues({ diff, item })
    })

    await waitFor(() => {
      return result.current != null
    })

    expect(result.current).toEqual({
      composedOf: [{ label: undefined, description: undefined }],
    })
  })
})
