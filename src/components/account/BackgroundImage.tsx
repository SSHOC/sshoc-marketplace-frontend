import Image from 'next/image'

import css from '@/components/account/BackgroundImage.module.css'
import Clouds from '~/public/assets/images/backgrounds/account@2x.png'

export function BackgroundImage(): JSX.Element {
  return (
    <div className={css['container']}>
      <Image src={Clouds} alt="" layout="fill" objectFit="contain" objectPosition="top" priority />
    </div>
  )
}