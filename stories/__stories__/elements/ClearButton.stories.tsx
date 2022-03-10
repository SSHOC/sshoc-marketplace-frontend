import type { Meta, StoryObj } from '@storybook/react'

import type { ClearButtonProps } from '@/lib/core/ui/ClearButton/ClearButton'
import { ClearButton } from '@/lib/core/ui/ClearButton/ClearButton'
import { Icon } from '@/lib/core/ui/Icon/Icon'
import CrossIcon from '@/lib/core/ui/icons/cross.svg?symbol-icon'

const meta: Meta<ClearButtonProps> = {
  title: 'Elements/ClearButton',
  component: ClearButton,
  argTypes: {
    onPress: { action: 'onPress' },
  },
}

export default meta

export const Default: StoryObj<ClearButtonProps> = {
  args: {},
}

export const WithCustomIcon: StoryObj<ClearButtonProps> = {
  args: {
    children: <Icon icon={CrossIcon} />,
  },
}
