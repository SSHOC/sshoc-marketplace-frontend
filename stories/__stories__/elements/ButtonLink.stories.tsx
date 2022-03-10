import type { Meta, StoryObj } from '@storybook/react'

import type { ButtonLinkProps } from '@/lib/core/ui/Button/ButtonLink'
import { ButtonLink } from '@/lib/core/ui/Button/ButtonLink'

const meta: Meta<ButtonLinkProps> = {
  title: 'Elements/ButtonLink',
  component: ButtonLink,
  argTypes: {
    onPress: { action: 'onPress' },
  },
}

export default meta

export const Default: StoryObj<ButtonLinkProps> = {
  args: {
    children: 'Click me',
  },
}

export const DefaultDisabled: StoryObj<ButtonLinkProps> = {
  args: {
    ...Default.args,
    isDisabled: true,
  },
}
