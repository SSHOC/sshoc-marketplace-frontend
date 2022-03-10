import { jest } from '@jest/globals'
import { renderHook } from '@testing-library/react-hooks'
import { Form } from 'react-final-form'

import { useItemDiffFormFieldsMetadata } from '@/components/item-form/useItemDiffFormFieldsMetadata'
import { useItemDiffFormInitialValues } from '@/components/item-form/useItemDiffFormInitialValues'
import { changed, deleted, equal, inserted } from '~/test/__fixtures__/diff'

describe('useItemDiffFormFieldsMetadata', () => {
  it('should not add diff metadata to form field when field is unchanged', async () => {
    const { diff, initialValues } = equal

    const setFieldData = jest.fn()

    renderHook(
      () => {
        return useItemDiffFormFieldsMetadata(diff)
      },
      { wrapper: createWrapper(initialValues, { ...diff, equal: false }, setFieldData) },
    )

    expect(setFieldData).not.toHaveBeenCalled()
  })

  it('should not add diff metadata to form fields when all fields are equal', async () => {
    const { diff, initialValues } = equal

    const setFieldData = jest.fn()

    renderHook(
      () => {
        return useItemDiffFormFieldsMetadata(diff)
      },
      { wrapper: createWrapper(initialValues, diff, setFieldData) },
    )

    expect(setFieldData).not.toHaveBeenCalled()
  })

  it('should add diff metadata to changed form fields', async () => {
    const { diff, initialValues } = changed

    const setFieldData = jest.fn()

    renderHook(
      () => {
        return useItemDiffFormFieldsMetadata(diff)
      },
      { wrapper: createWrapper(initialValues, diff, setFieldData) },
    )

    expect(setFieldData).toHaveBeenCalled()
    expect(
      setFieldData.mock.calls.map((args) => {
        if (Array.isArray(args)) return args[0]
      }),
    ).toMatchInlineSnapshot(`
      Array [
        Array [
          "label",
          Object {
            "diff": Object {
              "current": "The label",
              "status": "changed",
              "suggested": "The changed label",
            },
          },
        ],
        Array [
          "description",
          Object {
            "diff": Object {
              "current": "The description",
              "status": "changed",
              "suggested": "The changed description",
            },
          },
        ],
        Array [
          "version",
          Object {
            "diff": Object {
              "current": "1.0",
              "status": "changed",
              "suggested": "2.0",
            },
          },
        ],
        Array [
          "dateCreated",
          Object {
            "diff": Object {
              "current": "1970-01-01T00:00:00.000Z",
              "status": "changed",
              "suggested": "1970-01-01T00:00:00.002Z",
            },
          },
        ],
        Array [
          "dateLastUpdated",
          Object {
            "diff": Object {
              "current": "1970-01-01T00:00:00.000Z",
              "status": "changed",
              "suggested": "1970-01-01T00:00:00.002Z",
            },
          },
        ],
        Array [
          "accessibleAt[0]",
          Object {
            "diff": Object {
              "current": "http://approved.com",
              "status": "changed",
              "suggested": "http://suggested.com",
            },
          },
        ],
        Array [
          "externalIds[0]",
          Object {
            "diff": Object {
              "current": Object {
                "identifier": "123",
                "identifierService": Object {
                  "code": "123",
                  "label": "123",
                  "ord": 1,
                },
              },
              "status": "changed",
              "suggested": Object {
                "identifier": "456",
                "identifierService": Object {
                  "code": "123",
                  "label": "123",
                  "ord": 1,
                },
              },
            },
          },
        ],
        Array [
          "contributors[0]",
          Object {
            "diff": Object {
              "current": Object {
                "actor": Object {
                  "affiliations": Array [],
                  "externalIds": Array [],
                  "id": 123,
                  "name": "123",
                },
                "role": Object {
                  "code": "123",
                  "label": "123",
                  "ord": 1,
                },
              },
              "status": "changed",
              "suggested": Object {
                "actor": Object {
                  "affiliations": Array [],
                  "externalIds": Array [],
                  "id": 456,
                  "name": "123",
                },
                "role": Object {
                  "code": "123",
                  "label": "123",
                  "ord": 1,
                },
              },
            },
          },
        ],
        Array [
          "properties[0]",
          Object {
            "diff": Object {
              "current": Object {
                "type": Object {
                  "allowedVocabularies": Array [],
                  "code": "123",
                  "hidden": false,
                  "label": "123",
                  "ord": 1,
                  "type": "string",
                },
                "value": "123",
              },
              "status": "changed",
              "suggested": Object {
                "type": Object {
                  "allowedVocabularies": Array [],
                  "code": "123",
                  "hidden": false,
                  "label": "123",
                  "ord": 1,
                  "type": "string",
                },
                "value": "456",
              },
            },
          },
        ],
        Array [
          "media[0]",
          Object {
            "diff": Object {
              "current": Object {
                "info": Object {
                  "category": "image",
                  "hasThumbnail": true,
                  "location": Object {
                    "sourceUrl": "http://example.com/image.png",
                  },
                  "mediaId": "123",
                  "mimeType": "image/png",
                },
              },
              "status": "changed",
              "suggested": Object {
                "info": Object {
                  "category": "image",
                  "hasThumbnail": true,
                  "location": Object {
                    "sourceUrl": "http://example.com/image.png",
                  },
                  "mediaId": "456",
                  "mimeType": "image/png",
                },
              },
            },
          },
        ],
        Array [
          "relatedItems[0]",
          Object {
            "diff": Object {
              "current": Object {
                "category": "dataset",
                "description": "123",
                "id": 123,
                "label": "123",
                "persistentId": "123",
                "relation": Object {
                  "code": "123",
                  "label": "123",
                },
              },
              "status": "changed",
              "suggested": Object {
                "category": "dataset",
                "description": "123",
                "id": 123,
                "label": "123",
                "persistentId": "456",
                "relation": Object {
                  "code": "123",
                  "label": "123",
                },
              },
            },
          },
        ],
        Array [
          "thumbnail",
          Object {
            "diff": Object {
              "current": Object {
                "info": Object {
                  "category": "image",
                  "hasThumbnail": true,
                  "location": Object {
                    "sourceUrl": "http://example.com/image.png",
                  },
                  "mediaId": "123",
                  "mimeType": "image/png",
                },
              },
              "status": "changed",
              "suggested": Object {
                "info": Object {
                  "category": "image",
                  "hasThumbnail": true,
                  "location": Object {
                    "sourceUrl": "http://example.com/image.png",
                  },
                  "mediaId": "456",
                  "mimeType": "image/png",
                },
              },
            },
          },
        ],
      ]
    `)
  })

  it('should add diff metadata to deleted form fields', async () => {
    const { diff, initialValues } = deleted

    const setFieldData = jest.fn()

    renderHook(
      () => {
        return useItemDiffFormFieldsMetadata(diff)
      },
      { wrapper: createWrapper(initialValues, diff, setFieldData) },
    )

    expect(setFieldData).toHaveBeenCalled()
    expect(
      setFieldData.mock.calls.map((args) => {
        if (Array.isArray(args)) return args[0]
      }),
    ).toMatchInlineSnapshot(`
      Array [
        Array [
          "version",
          Object {
            "diff": Object {
              "current": "1.0",
              "status": "deleted",
              "suggested": undefined,
            },
          },
        ],
        Array [
          "dateCreated",
          Object {
            "diff": Object {
              "current": "1970-01-01T00:00:00.000Z",
              "status": "deleted",
              "suggested": undefined,
            },
          },
        ],
        Array [
          "dateLastUpdated",
          Object {
            "diff": Object {
              "current": "1970-01-01T00:00:00.000Z",
              "status": "deleted",
              "suggested": undefined,
            },
          },
        ],
        Array [
          "accessibleAt[0]",
          Object {
            "diff": Object {
              "current": "http://approved.com",
              "status": "deleted",
              "suggested": undefined,
            },
          },
        ],
        Array [
          "externalIds[0]",
          Object {
            "diff": Object {
              "current": Object {
                "identifier": "123",
                "identifierService": Object {
                  "code": "123",
                  "label": "123",
                  "ord": 1,
                },
              },
              "status": "deleted",
              "suggested": undefined,
            },
          },
        ],
        Array [
          "contributors[0]",
          Object {
            "diff": Object {
              "current": Object {
                "actor": Object {
                  "affiliations": Array [],
                  "externalIds": Array [],
                  "id": 123,
                  "name": "123",
                },
                "role": Object {
                  "code": "123",
                  "label": "123",
                  "ord": 1,
                },
              },
              "status": "deleted",
              "suggested": undefined,
            },
          },
        ],
        Array [
          "properties[0]",
          Object {
            "diff": Object {
              "current": Object {
                "type": Object {
                  "allowedVocabularies": Array [],
                  "code": "123",
                  "hidden": false,
                  "label": "123",
                  "ord": 1,
                  "type": "string",
                },
                "value": "123",
              },
              "status": "deleted",
              "suggested": undefined,
            },
          },
        ],
        Array [
          "media[0]",
          Object {
            "diff": Object {
              "current": Object {
                "info": Object {
                  "category": "image",
                  "hasThumbnail": true,
                  "location": Object {
                    "sourceUrl": "http://example.com/image.png",
                  },
                  "mediaId": "123",
                  "mimeType": "image/png",
                },
              },
              "status": "deleted",
              "suggested": undefined,
            },
          },
        ],
        Array [
          "relatedItems[0]",
          Object {
            "diff": Object {
              "current": Object {
                "category": "dataset",
                "description": "123",
                "id": 123,
                "label": "123",
                "persistentId": "123",
                "relation": Object {
                  "code": "123",
                  "label": "123",
                },
              },
              "status": "deleted",
              "suggested": undefined,
            },
          },
        ],
        Array [
          "thumbnail",
          Object {
            "diff": Object {
              "current": Object {
                "info": Object {
                  "category": "image",
                  "hasThumbnail": true,
                  "location": Object {
                    "sourceUrl": "http://example.com/image.png",
                  },
                  "mediaId": "123",
                  "mimeType": "image/png",
                },
              },
              "status": "deleted",
              "suggested": undefined,
            },
          },
        ],
      ]
    `)
  })

  it('should add diff metadata to inserted form fields', async () => {
    const { diff, initialValues } = inserted

    const setFieldData = jest.fn()

    renderHook(
      () => {
        return useItemDiffFormFieldsMetadata(diff)
      },
      { wrapper: createWrapper(initialValues, diff, setFieldData) },
    )

    expect(setFieldData).toHaveBeenCalled()
    expect(
      setFieldData.mock.calls.map((args) => {
        if (Array.isArray(args)) return args[0]
      }),
    ).toMatchInlineSnapshot(`
      Array [
        Array [
          "version",
          Object {
            "diff": Object {
              "current": undefined,
              "status": "inserted",
              "suggested": "1.0",
            },
          },
        ],
        Array [
          "dateCreated",
          Object {
            "diff": Object {
              "current": undefined,
              "status": "inserted",
              "suggested": "1970-01-01T00:00:00.000Z",
            },
          },
        ],
        Array [
          "dateLastUpdated",
          Object {
            "diff": Object {
              "current": undefined,
              "status": "inserted",
              "suggested": "1970-01-01T00:00:00.000Z",
            },
          },
        ],
        Array [
          "accessibleAt[0]",
          Object {
            "diff": Object {
              "current": undefined,
              "status": "inserted",
              "suggested": "http://approved.com",
            },
          },
        ],
        Array [
          "externalIds[0]",
          Object {
            "diff": Object {
              "current": undefined,
              "status": "inserted",
              "suggested": Object {
                "identifier": "123",
                "identifierService": Object {
                  "code": "123",
                  "label": "123",
                  "ord": 1,
                },
              },
            },
          },
        ],
        Array [
          "contributors[0]",
          Object {
            "diff": Object {
              "current": undefined,
              "status": "inserted",
              "suggested": Object {
                "actor": Object {
                  "affiliations": Array [],
                  "externalIds": Array [],
                  "id": 123,
                  "name": "123",
                },
                "role": Object {
                  "code": "123",
                  "label": "123",
                  "ord": 1,
                },
              },
            },
          },
        ],
        Array [
          "properties[0]",
          Object {
            "diff": Object {
              "current": undefined,
              "status": "inserted",
              "suggested": Object {
                "type": Object {
                  "allowedVocabularies": Array [],
                  "code": "123",
                  "hidden": false,
                  "label": "123",
                  "ord": 1,
                  "type": "string",
                },
                "value": "123",
              },
            },
          },
        ],
        Array [
          "media[0]",
          Object {
            "diff": Object {
              "current": undefined,
              "status": "inserted",
              "suggested": Object {
                "info": Object {
                  "category": "image",
                  "hasThumbnail": true,
                  "location": Object {
                    "sourceUrl": "http://example.com/image.png",
                  },
                  "mediaId": "123",
                  "mimeType": "image/png",
                },
              },
            },
          },
        ],
        Array [
          "relatedItems[0]",
          Object {
            "diff": Object {
              "current": undefined,
              "status": "inserted",
              "suggested": Object {
                "category": "dataset",
                "description": "123",
                "id": 123,
                "label": "123",
                "persistentId": "123",
                "relation": Object {
                  "code": "123",
                  "label": "123",
                },
              },
            },
          },
        ],
        Array [
          "thumbnail",
          Object {
            "diff": Object {
              "current": undefined,
              "status": "inserted",
              "suggested": Object {
                "info": Object {
                  "category": "image",
                  "hasThumbnail": true,
                  "location": Object {
                    "sourceUrl": "http://example.com/image.png",
                  },
                  "mediaId": "123",
                  "mimeType": "image/png",
                },
              },
            },
          },
        ],
      ]
    `)
  })
})

function createWrapper(_initialValues: any, diff: any, setFieldData: any) {
  return function Wrapper(props: { children: JSX.Element }) {
    const { children } = props

    function onSubmit() {
      return jest.fn()
    }

    const initialValues = useItemDiffFormInitialValues({ diff, item: _initialValues })

    return (
      <Form onSubmit={onSubmit} initialValues={initialValues} mutators={{ setFieldData }}>
        {({ handleSubmit }) => {
          return <form onSubmit={handleSubmit}>{children}</form>
        }}
      </Form>
    )
  }
}
