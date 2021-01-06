module.exports = {
  ...require('@stefanprobst/prettier-config'),
  overrides: [
    {
      files: ['**/*.md', '**/*.mdx'],
      options: {
        // netlify cms expects double quotes around markdown image titles
        singleQuote: false,
      },
    },
  ],
}
