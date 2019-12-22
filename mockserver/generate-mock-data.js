const fs = require('fs')

const range = n => [...Array(n).keys()]
const pick = arr => arr[Math.floor(Math.random() * arr.length)]

const ITEMS_COUNT = 400

const categories = ['dataset', 'tool', 'training-material']
const description =
  `# Heading\n\n` +
  `Lorem ipsum dolor sit amet [consectetur](https://example.com) adipisicing elit. ` +
  `Dolor velit mollitia ad numquam, *adipisci* quod accusamus illo saepe. Excepturi ` +
  `error libero amet nostrum numquam eveniet. Consectetur iusto ipsam deserunt architecto?\n\n` +
  `## Subheading\n\n` +
  `Lorem ipsum **dolor** sit amet consectetur adipisicing elit. Dolor velit ` +
  `mollitia \`ad numquam\`, adipisci quod accusamus illo saepe. Excepturi error ` +
  `libero amet nostrum numquam eveniet. Consectetur ![iusto](https://example.com/img.png) ` +
  `ipsam deserunt architecto?\n\n` +
  `Code block:\n\n` +
  `\`\`\`js\nconst hello = 'world';\n\`\`\`\n`

const items = range(ITEMS_COUNT).reduce((acc, id) => {
  acc[id] = {
    id,
    label: `Item ${id}`,
    category: pick(categories),
    contributors: [],
    properties: [
      {
        type: { code: 'object-type', label: 'Object type' },
        concept: { label: 'Item' },
      },
    ],
    description,
  }
  return acc
}, {})

fs.writeFileSync('db-mock.json', JSON.stringify(items))
