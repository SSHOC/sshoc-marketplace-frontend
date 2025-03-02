import Image from 'next/legacy/image'

import css from '@/components/terms-of-use/BackgroundImage.module.css'
import Clouds from '~/public/assets/images/backgrounds/terms-of-use@2x.png'

export function BackgroundImage(): JSX.Element {
  return (
    <div className={css['container']}>
      <Image src={Clouds} alt="" layout="fill" objectFit="contain" objectPosition="top" priority />
    </div>
  )
}
