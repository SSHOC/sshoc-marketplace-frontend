import { Fragment } from 'react'

import { LinkButton } from '@/components/common/LinkButton'
import css from '@/components/item/ItemAccessibleAtLinks.module.css'
import type { Item } from '@/data/sshoc/api/item'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { Item as MenuItem } from '@/lib/core/ui/Collection/Item'
import { Icon } from '@/lib/core/ui/Icon/Icon'
import ChevronIcon from '@/lib/core/ui/icons/chevron.svg?symbol-icon'
import LinkIcon from '@/lib/core/ui/icons/external-link.svg?symbol-icon'
import { Menu } from '@/lib/core/ui/Menu/Menu'
import { MenuTrigger } from '@/lib/core/ui/Menu/MenuTrigger'

export interface ItemAccessibleAtLinksProps {
  category: Item['category']
  links: Item['accessibleAt']
}

export function ItemAccessibleAtLinks(props: ItemAccessibleAtLinksProps): JSX.Element | null {
  const { category, links } = props

  const { t } = useI18n<'common'>()

  if (links.length === 0) {
    return null
  }

  if (links.length === 1) {
    return (
      <div className={css['link-button']}>
        <LinkButton href={links[0]!} target="_blank" rel="noreferrer">
          {t(['common', 'item', 'go-to-item'], {
            values: {
              item: t(['common', 'item-categories', category, 'one']),
            },
          })}
          <Icon icon={LinkIcon} />
        </LinkButton>
      </div>
    )
  }

  return <ItemAccessibleAtLinksMenuButton category={category} links={links} />
}

function ItemAccessibleAtLinksMenuButton(props: ItemAccessibleAtLinksProps): JSX.Element {
  const { category, links } = props

  const { t } = useI18n<'common'>()

  const items = links.map((link) => {
    return { id: link, href: link, type: 'link' }
  })

  return (
    <div className={css['link-button']}>
      <MenuTrigger
        label={
          <Fragment>
            {t(['common', 'item', 'go-to-item'], {
              values: {
                item: t(['common', 'item-categories', category, 'one']),
              },
            })}
            <Icon icon={ChevronIcon} width="0.75em" />
          </Fragment>
        }
      >
        <Menu items={items}>
          {(item) => {
            const props = { href: item.href, target: '_blank', rel: 'noreferrer' }

            return <MenuItem {...props}>{item.href}</MenuItem>
          }}
        </Menu>
      </MenuTrigger>
    </div>
  )
}
