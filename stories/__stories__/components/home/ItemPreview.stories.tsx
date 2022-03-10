import type { Meta, StoryObj } from '@storybook/react'

import type { ItemPreviewProps } from '@/components/common/ItemPreview'
import { ItemPreview } from '@/components/common/ItemPreview'
import type { ItemSearchResult } from '@/data/sshoc/api/item'

// FIXME: generate from mock db
const item: ItemSearchResult = {
  persistentId: 'abc',
  id: 123,
  category: 'training-material',
  label: 'Name of the Training material',
  description:
    'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quas facere, nesciunt doloremque fuga eius blanditiis eaque tempora vero, reprehenderit voluptate facilis? Atque quia nihil animi quos voluptas, voluptatum optio aliquid? Nulla non laudantium, beatae a maxime doloremque aspernatur, magnam perferendis enim atque, omnis saepe necessitatibus architecto! Cupiditate dolorum quia velit autem aut at, vitae qui ullam, eos saepe nobis totam? Aliquam aperiam consequatur consequuntur, suscipit laboriosam necessitatibus rerum soluta voluptatem alias aut. Sapiente facere eius ea voluptate! Vel dolore minima ratione error neque? Accusamus veritatis nesciunt, veniam voluptate libero ut. Maxime sapiente ea, beatae consectetur possimus mollitia fugiat ipsam autem obcaecati accusantium cumque porro tenetur velit veniam nulla saepe alias libero delectus dolorem officia numquam reiciendis, non, magni dicta! Veritatis. Veritatis consectetur vero quasi recusandae. Cum officia blanditiis accusantium ipsum ducimus nulla amet nostrum quasi mollitia ratione tenetur repellendus, ullam illum quae facere, saepe pariatur iste sapiente nisi dolor eaque? Cupiditate, a pariatur tempora earum perferendis laudantium ex rerum similique. Natus nam alias quisquam est velit facilis iure! Vero iure quibusdam dolorum hic temporibus ut natus reiciendis? Laudantium, officia asperiores.',
  contributors: [],
  status: 'approved',
  owner: 'Administrator',
  lastInfoUpdate: 'Thu Oct 28 00:18:39 UTC 2021',
  properties: [
    {
      type: {
        code: 'activity',
        label: 'Activity',
        type: 'concept',
        groupName: 'Categorisation',
        hidden: false,
        ord: 1,
        allowedVocabularies: [
          {
            code: 'tadirah',
            scheme: 'https://vocabs.dariah.eu/tadirah/',
            label: '',
            closed: false,
          },
        ],
      },
      concept: {
        code: 'https://vocabs.dariah.eu/tadirah/disseminating',
        vocabulary: {
          code: 'tadirah',
          scheme: 'https://vocabs.dariah.eu/tadirah/',
          label: '',
          closed: false,
        },
        label: 'Disseminating',
        notation: '',
        uri: 'https://vocabs.dariah.eu/tadirah/disseminating',
        candidate: false,
      },
    },
    {
      type: {
        code: 'activity',
        label: 'Activity',
        type: 'concept',
        groupName: 'Categorisation',
        hidden: false,
        ord: 1,
        allowedVocabularies: [
          {
            code: 'tadirah',
            scheme: 'https://vocabs.dariah.eu/tadirah/',
            label: '',
            closed: false,
          },
        ],
      },
      concept: {
        code: 'https://vocabs.dariah.eu/tadirah/caffeinating',
        vocabulary: {
          code: 'tadirah',
          scheme: 'https://vocabs.dariah.eu/tadirah/',
          label: '',
          closed: false,
        },
        label: 'Caffeinating',
        notation: '',
        uri: 'https://vocabs.dariah.eu/tadirah/caffeinating',
        candidate: true,
      },
    },
    {
      type: {
        code: 'keyword',
        label: 'Keyword',
        type: 'concept',
        groupName: 'Categorisation',
        hidden: false,
        ord: 2,
        allowedVocabularies: [
          {
            code: 'sshoc-keyword',
            scheme: 'https://vocabs.dariah.eu/sshoc-keyword/Schema',
            label: 'Keywords from SSHOC MP',
            closed: false,
          },
        ],
      },
      concept: {
        code: 'Discovering',
        vocabulary: {
          code: 'sshoc-keyword',
          scheme: 'https://vocabs.dariah.eu/sshoc-keyword/Schema',
          label: 'Keywords from SSHOC MP',
          closed: false,
        },
        label: 'Discovering',
        notation: 'Discovering',
        uri: 'https://vocabs.dariah.eu/sshoc-keyword/Discovering',
        candidate: true,
      },
    },
  ],
}

const meta: Meta<ItemPreviewProps> = {
  title: 'Components/Home/ItemPreview',
  component: ItemPreview,
}

export default meta

export const Default: StoryObj<ItemPreviewProps> = {
  args: {
    item,
  },
}
