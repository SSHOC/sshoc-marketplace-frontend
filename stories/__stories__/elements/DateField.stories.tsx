import type { Meta, StoryObj } from '@storybook/react'

import type { DateFieldProps } from '@/lib/core/ui/DateField/DateField'
import { DateField } from '@/lib/core/ui/DateField/DateField'

const meta: Meta<DateFieldProps> = {
  title: 'Elements/DateField',
  component: DateField,
  argTypes: {
    onChange: { action: 'onChange' },
    onFocusChange: { action: 'onFocusChange' },
  },
}

export default meta

export const Default: StoryObj<DateFieldProps> = {
  args: {},
}

export const DefaultDisabled: StoryObj<DateFieldProps> = {
  args: {
    ...Default.args,
    isDisabled: true,
  },
}

export const ColorPrimary: StoryObj<DateFieldProps> = {
  args: {
    ...Default.args,
    color: 'primary',
  },
}

export const ColorForm: StoryObj<DateFieldProps> = {
  args: {
    ...Default.args,
    color: 'form',
  },
}

export const SizeSm: StoryObj<DateFieldProps> = {
  args: {
    ...Default.args,
    size: 'sm',
  },
}

export const SizeMd: StoryObj<DateFieldProps> = {
  args: {
    ...Default.args,
    size: 'md',
  },
}

export const SizeLg: StoryObj<DateFieldProps> = {
  args: {
    ...Default.args,
    size: 'lg',
  },
}

export const WithHelpText: StoryObj<DateFieldProps> = {
  args: {
    ...Default.args,
    description: 'The help text.',
  },
}

export const Valid: StoryObj<DateFieldProps> = {
  args: {
    ...Default.args,
    validationState: 'valid',
  },
}

export const Invalid: StoryObj<DateFieldProps> = {
  args: {
    ...Default.args,
    validationState: 'invalid',
  },
}

export const WithErrorMessage: StoryObj<DateFieldProps> = {
  args: {
    ...Invalid.args,
    errorMessage: 'The error message.',
  },
}
