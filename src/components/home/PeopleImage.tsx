import Image from 'next/image'

import css from '@/components/home/PeopleImage.module.css'
import People from '~/public/assets/images/backgrounds/home-people.svg'

export function PeopleImage(): JSX.Element {
  return (
    <div className={css['container']}>
      <Image src={People} alt="" layout="fill" objectFit="contain" objectPosition="bottom" />
    </div>
  )
}
