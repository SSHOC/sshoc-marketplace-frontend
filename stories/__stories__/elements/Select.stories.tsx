import { OverlayProvider } from '@react-aria/overlays'
import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useState } from 'react'

import { Item } from '@/lib/core/ui/Collection/Item'
import { Section } from '@/lib/core/ui/Collection/Section'
import type { SelectProps } from '@/lib/core/ui/Select/Select'
import { Select } from '@/lib/core/ui/Select/Select'
import { times } from '@/lib/utils'

interface Entity {
  id: string
  label: string
}

const items: Array<Entity> = [
  { id: '1', label: 'The first item' },
  { id: '2', label: 'The second item' },
  { id: '3', label: 'The third item' },
  { id: '4', label: 'The fourth item' },
]

const meta: Meta<SelectProps<Entity>> = {
  title: 'Elements/Select',
  component: Select,
  argTypes: {
    onFocusChange: { action: 'onFocusChange' },
    onLoadMore: { action: 'onLoadMore' },
    onOpenChange: { action: 'onOpenChange' },
    onSelectionChange: { action: 'onSelectionChange' },
  },
  decorators: [
    function withOverlayProvider(Story) {
      return (
        <OverlayProvider>
          <Story />
        </OverlayProvider>
      )
    },
  ],
}

export default meta

export const Default: StoryObj<SelectProps<Entity>> = {
  args: {
    'aria-label': 'The combobox',
    items,
    children(item) {
      return <Item>{item.label}</Item>
    },
  },
}

export const DefaultDisabled: StoryObj<SelectProps<Entity>> = {
  args: {
    ...Default.args,
    isDisabled: true,
  },
}

export const ColorPrimary: StoryObj<SelectProps<Entity>> = {
  args: {
    ...Default.args,
    color: 'primary',
  },
}

export const ColorForm: StoryObj<SelectProps<Entity>> = {
  args: {
    ...Default.args,
    color: 'form',
  },
}

export const SizeSm: StoryObj<SelectProps<Entity>> = {
  args: {
    ...Default.args,
    size: 'sm',
  },
}

export const SizeMd: StoryObj<SelectProps<Entity>> = {
  args: {
    ...Default.args,
    size: 'md',
  },
}

export const Empty: StoryObj<SelectProps<Entity>> = {
  args: {
    ...Default.args,
    items: [],
  },
}

export const Placeholder: StoryObj<SelectProps<Entity>> = {
  args: {
    ...Default.args,
    placeholder: 'Placeholder',
  },
}

// export const NoResultsMessage: StoryObj<SelectProps<Entity>> = {
//   args: {
//     ...Default.args,
//   },
// }

export const Long: StoryObj<SelectProps<Entity>> = {
  args: {
    ...Default.args,
    items: times(50).map((_, index) => {
      return { id: String(index), label: 'Item ' + index }
    }),
  },
}

export const MaxHeight: StoryObj<SelectProps<Entity>> = {
  args: {
    ...Default.args,
    items: times(50).map((_, index) => {
      return { id: String(index), label: 'Item ' + index }
    }),
    maxHeight: 200,
  },
}

export const WithHelpText: StoryObj<SelectProps<Entity>> = {
  args: {
    ...Default.args,
    description: 'This is the help text.',
  },
}

export const Valid: StoryObj<SelectProps<Entity>> = {
  args: {
    ...Default.args,
    validationState: 'valid',
  },
}

export const Invalid: StoryObj<SelectProps<Entity>> = {
  args: {
    ...Default.args,
    validationState: 'invalid',
  },
}

export const WithErrorMessage: StoryObj<SelectProps<Entity>> = {
  args: {
    ...Invalid.args,
    errorMessage: 'This is the error message.',
  },
}

export function AsyncLoad() {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success'>('idle')
  const [results, setResults] = useState<Array<Entity>>([])

  useEffect(() => {
    async function load() {
      await new Promise((resolve) => {
        return setTimeout(resolve, 1000)
      })

      setResults(items)

      setStatus('success')
    }

    setStatus('pending')
    load()
  }, [])

  return (
    <Select items={results} loadingState={status === 'pending' ? 'loading' : 'idle'}>
      {(item) => {
        return <Item>{item.label}</Item>
      }}
    </Select>
  )
}
