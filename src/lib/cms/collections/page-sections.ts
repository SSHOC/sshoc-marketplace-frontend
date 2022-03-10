import type { CmsCollection } from 'netlify-cms-core'

export const collection: CmsCollection = {
  name: 'page-sections',
  label: 'Page sections',
  label_singular: 'Page section',
  format: 'frontmatter',
  extension: 'mdx',
  files: [
    {
      file: 'src/components/contact/Contact.mdx',
      name: 'contact-page-section',
      label: 'Contact page section',
      fields: [
        {
          name: 'title',
          label: 'Title',
        },
        {
          name: 'body',
          label: 'Text',
          widget: 'markdown',
        },
      ],
    },
    {
      file: 'src/components/privacy-policy/Privacy policy.mdx',
      name: 'privacy-policy-page-section',
      label: 'Privacy policy page section',
      fields: [
        {
          name: 'title',
          label: 'Title',
        },
        {
          name: 'body',
          label: 'Text',
          widget: 'markdown',
        },
      ],
    },
  ],
}
