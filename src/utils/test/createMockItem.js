import { ITEM_CATEGORY } from '../../constants'
import { pick } from '../pick'

export const createMockItem = id => ({
  id,
  label: `Item ${id}`,
  category: pick(Object.keys(ITEM_CATEGORY)),
  description:
    '# Heading1\n\n' +
    'Lorem ipsum, [dolor sit *amet* consectetur](https://example.com) ' +
    'adipisicing elit. `Harum dolore`, eligendi velit, **numquam** aut ' +
    'officia dicta veniam sequi eum doloribus fuga quam facere adipisci ' +
    'asperiores facilis! Vitae iusto accusantium ipsa?\n\n' +
    'Lorem ipsum, [dolor sit *amet* consectetur](https://example.com) ' +
    'adipisicing elit. `Harum dolore`, eligendi velit, **numquam** aut ' +
    'officia dicta veniam sequi eum doloribus fuga quam facere adipisci ' +
    'asperiores facilis! Vitae iusto accusantium ipsa?\n\n' +
    '## Heading2\n\n' +
    'Lorem ipsum:\n\n' +
    '* dolor sit\n' +
    '* amet consectetur\n' +
    '  - adipisicing elit\n' +
    '  - harum dolore\n' +
    '* eligendi velit\n\n' +
    'Code block:\n\n' +
    '```js\n' +
    'function hello() {\n' +
    '  const world = "world";\n' +
    '  return "hello" + world;\n' +
    '}\n' +
    '```\n',
  contributors: [
    {
      actor: {
        name: 'Somebody',
        email: 'somebody@example.com',
        website: 'https://www.example.com',
      },
    },
    {
      actor: {
        name: 'Somebody else',
        email: 'somebodyelse@example.com',
        website: 'https://www.example.com',
      },
    },
  ],
  properties: [
    {
      type: { code: 'object-type', label: 'Object type' },
      concept: { label: pick(['Paper', 'Service', 'Software']) },
    },
    {
      type: { code: 'language', label: 'Language' },
      concept: { label: 'eng' },
    },
    {
      type: { code: 'activity', label: 'Activity' },
      concept: { label: 'Writing' },
    },
  ],
})
