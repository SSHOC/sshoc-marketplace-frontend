import Link from 'next/link'

import styles from '@/components/item-form/FormHelpText.module.css'

export function FormHelpText(): JSX.Element {
  return (
    <p className={styles['text']}>
      If you need more details on metadata fields, please consult{' '}
      <Link href="/contribute/metadata-guidelines#guidance-for-metadata-fields">
        <a>our guidelines</a>
      </Link>
      , or{' '}
      <Link href="/contact">
        <a>contact the Editorial Team</a>
      </Link>
      !
    </p>
  )
}
