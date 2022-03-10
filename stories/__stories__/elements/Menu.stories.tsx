import { OverlayProvider } from '@react-aria/overlays'
import type { Meta, StoryObj } from '@storybook/react'
import { Fragment, useEffect, useState } from 'react'

import { Item } from '@/lib/core/ui/Collection/Item'
import { Section } from '@/lib/core/ui/Collection/Section'
import { Icon } from '@/lib/core/ui/Icon/Icon'
import ChevronIcon from '@/lib/core/ui/icons/chevron.svg?symbol-icon'
import { Menu } from '@/lib/core/ui/Menu/Menu'
import type { MenuTriggerProps } from '@/lib/core/ui/Menu/MenuTrigger'
import { MenuTrigger } from '@/lib/core/ui/Menu/MenuTrigger'
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

const links: Array<{ id: string; href: string }> = [
  { id: '1', href: 'http://example.com/1' },
  { id: '2', href: 'http://example.com/2' },
  { id: '3', href: 'http://example.com/3' },
  { id: '4', href: 'http://example.com/4' },
]

const meta: Meta<MenuTriggerProps> = {
  title: 'Elements/Menu',
  component: MenuTrigger,
  argTypes: {},
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

export const Default: StoryObj<MenuTriggerProps> = {
  args: {
    label: (
      <Fragment>
        The navigation menu
        <Icon icon={ChevronIcon} width="0.75em" />
      </Fragment>
    ),
    children: (
      <Menu items={items}>
        {(item) => {
          return <Item>{item.label}</Item>
        }}
      </Menu>
    ),
  },
}

export const Links: StoryObj<MenuTriggerProps> = {
  args: {
    ...Default.args,
    children: (
      <Menu items={links}>
        {(item) => {
          return (
            <Item {...item} rel="noreferrer" target="_blank">
              {item.href}
            </Item>
          )
        }}
      </Menu>
    ),
  },
}
