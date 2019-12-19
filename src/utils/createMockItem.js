import { ITEM_CATEGORY } from '../constants'
import { pick } from './pick'

export const createMockItem = id => ({
  id,
  label: `Item ${id}`,
  category: pick(Object.keys(ITEM_CATEGORY)),
  description:
    'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum dolore, ' +
    'eligendi velit, numquam aut officia dicta veniam sequi eum doloribus fuga ' +
    'quam facere adipisci asperiores facilis! Vitae iusto accusantium ipsa?',
  contributors: [{ actor: { name: 'Everybody' } }],
  properties: [
    {
      type: { code: 'object-type', label: 'Object type' },
      concept: { label: pick(['Paper', 'Service', 'Software']) },
    },
  ],
})
