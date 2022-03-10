import type { LinkProps } from '@/components/common/Link'
import { Link } from '@/components/common/Link'
import css from '@/components/home/SubSectionHeaderLink.module.css'

export function SubSectionHeaderLink(props: LinkProps): JSX.Element {
  return (
    <span className={css['link']}>
      <Link {...props} />
    </span>
  )
}
