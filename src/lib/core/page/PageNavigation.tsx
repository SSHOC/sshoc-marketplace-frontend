import { Item } from '@react-stately/collections'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import type { Key } from 'react'
import { Fragment } from 'react'

import { NavLink } from '@/components/common/NavLink'
import { NavigationMenu } from '@/lib/core/page/NavigationMenu'
import css from '@/lib/core/page/PageNavigation.module.css'
import { useAboutNavItems } from '@/lib/core/page/useAboutNavItems'
import { useBrowseNavItems } from '@/lib/core/page/useBrowseNavItems'
import { useContributeNavItems } from '@/lib/core/page/useContributeNavItems'
import { useItemCategoryNavItems } from '@/lib/core/page/useItemCategoryNavItems'

export function PageNavigation(): JSX.Element {
  return (
    <nav className={css['main-nav']}>
      <ul className={css['nav-items']} role="list">
        <ItemCategoryNavLinks />
        <Separator />
        <BrowseNavMenu />
        <Separator />
        <ContributeNavMenu />
        <AboutNavMenu />
      </ul>
    </nav>
  )
}

function ItemCategoryNavLinks(): JSX.Element {
  const items = useItemCategoryNavItems()

  if (items == null) {
    return <Fragment />
  }

  return (
    <Fragment>
      {items.map((item) => {
        return (
          <li className={css['nav-item']} key={item.id}>
            <NavLink variant="nav-link-header" href={item.href}>
              {item.label}
            </NavLink>
          </li>
        )
      })}
    </Fragment>
  )
}

function BrowseNavMenu(): JSX.Element {
  const t = useTranslations('common')
  const items = useBrowseNavItems()
  const router = useRouter()

  function onAction(key: Key) {
    const item = items.find((item) => {
      return item.id === key
    })

    if (item == null) return

    router.push(item.href)
  }

  return (
    <li className={css['nav-item']}>
      <NavigationMenu label={t('pages.browse')} items={items} onAction={onAction}>
        {(item) => {
          const props = { href: item.href }

          return <Item {...props}>{item.label}</Item>
        }}
      </NavigationMenu>
    </li>
  )
}

function ContributeNavMenu(): JSX.Element {
  const t = useTranslations('common')
  const items = useContributeNavItems()
  const router = useRouter()

  function onAction(key: Key) {
    const item = items.find((item) => {
      return item.id === key
    })

    if (item == null) return

    router.push(item.href)
  }

  return (
    <li className={css['nav-item']}>
      <NavigationMenu label={t('pages.contribute')} items={items} onAction={onAction}>
        {(item) => {
          const props = { href: item.href }

          return <Item {...props}>{item.label}</Item>
        }}
      </NavigationMenu>
    </li>
  )
}

function AboutNavMenu(): JSX.Element {
  const t = useTranslations('common')
  const items = useAboutNavItems()
  const router = useRouter()

  function onAction(key: Key) {
    const item = items.find((item) => {
      return item.id === key
    })

    if (item == null) return

    router.push(item.href)
  }

  return (
    <li className={css['nav-item']}>
      <NavigationMenu label={t('pages.about')} items={items} onAction={onAction}>
        {(item) => {
          const props = { href: item.href }

          return <Item {...props}>{item.label}</Item>
        }}
      </NavigationMenu>
    </li>
  )
}

function Separator(): JSX.Element {
  return <li role="separator" className={css['nav-separator']} />
}
