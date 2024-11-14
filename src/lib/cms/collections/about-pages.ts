import type { CmsCollection } from "decap-cms-core";

export const collection: CmsCollection = {
  name: "about-pages",
  label: "About pages",
  label_singular: "About page",
  format: "frontmatter",
  extension: "mdx",
  folder: "src/app/about/[id]/_content",
  /** Disallow creating new pages to ensure sensible route pathnames. */
  create: false,
  delete: false,
  fields: [
    {
      name: "title",
      label: "Title",
    },
    {
      name: "navigationMenu",
      label: "Navigation menu",
      widget: "object",
      fields: [
        { name: "title", label: "Title" },
        { name: "position", label: "Position", widget: "number" },
      ],
    },
    {
      name: "body",
      label: "Text",
      widget: "markdown",
    },
    {
      name: "toc",
      label: "Show table of contents",
      widget: "boolean",
      required: false,
    },
  ],
};
