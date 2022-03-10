import { OverlayProvider } from '@react-aria/overlays'
import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useState } from 'react'

import { Item } from '@/lib/core/ui/Collection/Item'
import { Section } from '@/lib/core/ui/Collection/Section'
import type { ComboBoxProps } from '@/lib/core/ui/ComboBox/ComboBox'
import { ComboBox } from '@/lib/core/ui/ComboBox/ComboBox'
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

const meta: Meta<ComboBoxProps<Entity>> = {
  title: 'Elements/ComboBox',
  component: ComboBox,
  argTypes: {
    onFocusChange: { action: 'onFocusChange' },
    onInputChange: { action: 'onInputChange' },
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

export const Default: StoryObj<ComboBoxProps<Entity>> = {
  args: {
    'aria-label': 'The combobox',
    defaultItems: items,
    children(item) {
      return <Item>{item.label}</Item>
    },
  },
}

export const DefaultDisabled: StoryObj<ComboBoxProps<Entity>> = {
  args: {
    ...Default.args,
    isDisabled: true,
  },
}

export const ColorPrimary: StoryObj<ComboBoxProps<Entity>> = {
  args: {
    ...Default.args,
    color: 'primary',
  },
}

export const ColorForm: StoryObj<ComboBoxProps<Entity>> = {
  args: {
    ...Default.args,
    color: 'form',
  },
}

export const SizeSm: StoryObj<ComboBoxProps<Entity>> = {
  args: {
    ...Default.args,
    size: 'sm',
  },
}

export const SizeMd: StoryObj<ComboBoxProps<Entity>> = {
  args: {
    ...Default.args,
    size: 'md',
  },
}

export const Empty: StoryObj<ComboBoxProps<Entity>> = {
  args: {
    ...Default.args,
    defaultItems: [],
  },
}

export const Placeholder: StoryObj<ComboBoxProps<Entity>> = {
  args: {
    ...Default.args,
    placeholder: 'Placeholder',
  },
}

// export const NoResultsMessage: StoryObj<ComboBoxProps<Entity>> = {
//   args: {
//     ...Default.args,
//   },
// }

export const Long: StoryObj<ComboBoxProps<Entity>> = {
  args: {
    ...Default.args,
    defaultItems: times(50).map((_, index) => {
      return { id: String(index), label: 'Item ' + index }
    }),
  },
}

export const MaxHeight: StoryObj<ComboBoxProps<Entity>> = {
  args: {
    ...Default.args,
    defaultItems: times(50).map((_, index) => {
      return { id: String(index), label: 'Item ' + index }
    }),
    maxHeight: 200,
  },
}

export const WithHelpText: StoryObj<ComboBoxProps<Entity>> = {
  args: {
    ...Default.args,
    description: 'This is the help text.',
  },
}

export const Valid: StoryObj<ComboBoxProps<Entity>> = {
  args: {
    ...Default.args,
    validationState: 'valid',
  },
}

export const Invalid: StoryObj<ComboBoxProps<Entity>> = {
  args: {
    ...Default.args,
    validationState: 'invalid',
  },
}

export const WithErrorMessage: StoryObj<ComboBoxProps<Entity>> = {
  args: {
    ...Invalid.args,
    errorMessage: 'This is the error message.',
  },
}

export function AsyncLoad() {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success'>('idle')
  const [inputValue, setInputValue] = useState('')
  const [results, setResults] = useState<Array<Entity>>([])

  useEffect(() => {
    async function load() {
      await new Promise((resolve) => {
        return setTimeout(resolve, 1000)
      })

      if (inputValue === '') {
        setResults([])
      } else {
        setResults(
          items.filter((item) => {
            return item.label.toLowerCase().includes(inputValue)
          }),
        )
      }

      setStatus('success')
    }

    setStatus('pending')
    load()
  }, [inputValue])

  return (
    <ComboBox
      inputValue={inputValue}
      items={results}
      loadingState={status === 'pending' ? 'loading' : 'idle'}
      onInputChange={setInputValue}
    >
      {(item) => {
        return <Item>{item.label}</Item>
      }}
    </ComboBox>
  )
}
