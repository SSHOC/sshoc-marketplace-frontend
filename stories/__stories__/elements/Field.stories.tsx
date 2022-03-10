import type { Meta, StoryObj } from '@storybook/react'

import type { FieldProps } from '@/lib/core/ui/Field/Field'
import { Field } from '@/lib/core/ui/Field/Field'
import { TextField } from '@/lib/core/ui/TextField/TextField'

const meta: Meta<FieldProps> = {
  title: 'Elements/Field',
  component: Field,
}

export default meta

export const Default: StoryObj<FieldProps> = {
  args: {
    children: <TextField />,
    label: 'The label',
  },
}

export const DefaultDisabled: StoryObj<FieldProps> = {
  args: {
    ...Default.args,
    children: <TextField isDisabled />,
    isDisabled: true,
  },
}

export const Required: StoryObj<FieldProps> = {
  args: {
    ...Default.args,
    isRequired: true,
  },
}

export const WithHelpText: StoryObj<FieldProps> = {
  args: {
    ...Default.args,
    description: 'The help text',
  },
}

export const WithErrorMessage: StoryObj<FieldProps> = {
  args: {
    ...Default.args,
    errorMessage: 'The help text',
    validationState: 'invalid',
  },
}
