import type { CmsCollection } from 'decap-cms-core'

export const collection: CmsCollection = {
  name: 'contribute-pages',
  label: 'Contribute pages',
  label_singular: 'Contribute page',
  format: 'frontmatter',
  extension: 'mdx',
  folder: 'src/pages/contribute',
  /** Disallow creating new pages to ensure sensible route pathnames. */
  create: false,
  delete: false,
  fields: [
    {
      name: 'title',
      label: 'Title',
    },
    {
      name: 'navigationMenu',
      label: 'Navigation menu',
      widget: 'object',
      fields: [
        { name: 'title', label: 'Title' },
        { name: 'position', label: 'Position', widget: 'number' },
      ],
    },
    {
      name: 'body',
      label: 'Text',
      widget: 'markdown',
    },
    {
      name: 'toc',
      label: 'Show table of contents',
      widget: 'boolean',
      required: false,
    },
  ],
}
