import type { Meta, StoryObj } from '@storybook/react'

import type { ButtonProps } from '@/lib/core/ui/Button/Button'
import { Button } from '@/lib/core/ui/Button/Button'
import { Icon } from '@/lib/core/ui/Icon/Icon'
import PencilIcon from '@/lib/core/ui/icons/pencil.svg?symbol-icon'
import { ProgressSpinner } from '@/lib/core/ui/ProgressSpinner/ProgressSpinner'

const meta: Meta<ButtonProps> = {
  title: 'Elements/Button',
  component: Button,
  argTypes: {
    onPress: { action: 'onPress' },
  },
}

export default meta

export const Default: StoryObj<ButtonProps> = {
  args: {
    children: 'Click me',
  },
}

export const DefaultDisabled: StoryObj<ButtonProps> = {
  args: {
    ...Default.args,
    isDisabled: true,
  },
}

export const VariantFill: StoryObj<ButtonProps> = {
  args: {
    ...Default.args,
    variant: 'fill',
  },
}

export const VariantFillDisabled: StoryObj<ButtonProps> = {
  args: {
    ...VariantFill.args,
    isDisabled: true,
  },
}

export const ColorPrimary: StoryObj<ButtonProps> = {
  args: {
    ...Default.args,
    color: 'primary',
  },
}

export const ColorPrimaryDisabled: StoryObj<ButtonProps> = {
  args: {
    ...ColorPrimary.args,
    isDisabled: true,
  },
}

export const ColorSecondary: StoryObj<ButtonProps> = {
  args: {
    ...Default.args,
    color: 'secondary',
  },
}

export const ColorSecondaryDisabled: StoryObj<ButtonProps> = {
  args: {
    ...ColorSecondary.args,
    isDisabled: true,
  },
}

export const ColorGradient: StoryObj<ButtonProps> = {
  args: {
    ...Default.args,
    color: 'gradient',
  },
}

export const ColorGradientDisabled: StoryObj<ButtonProps> = {
  args: {
    ...ColorGradient.args,
    isDisabled: true,
  },
}

export const SizeXs: StoryObj<ButtonProps> = {
  args: {
    ...Default.args,
    size: 'xs',
  },
}

export const SizeSm: StoryObj<ButtonProps> = {
  args: {
    ...Default.args,
    size: 'sm',
  },
}

export const SizeMd: StoryObj<ButtonProps> = {
  args: {
    ...Default.args,
    size: 'md',
  },
}

export const SizeLg: StoryObj<ButtonProps> = {
  args: {
    ...Default.args,
    size: 'lg',
  },
}

export const WithIcon: StoryObj<ButtonProps> = {
  args: {
    ...Default.args,
    children: [<Icon key="icon" icon={PencilIcon} />, 'Click me'],
  },
}

export const WithProgressSpinner: StoryObj<ButtonProps> = {
  args: {
    ...Default.args,
    children: [<ProgressSpinner key="progress-spinner" size="sm" />, 'Click me'],
  },
}
