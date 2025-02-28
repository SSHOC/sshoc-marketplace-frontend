import Image from "next/legacy/image"

import css from '@/components/item-form/BackgroundImage.module.css'
import Clouds from '~/public/assets/images/backgrounds/item-form@2x.png'

export function BackgroundImage(): JSX.Element {
  return (
    <div className={css['container']}>
      <Image src={Clouds} alt="" layout="fill" objectFit="contain" objectPosition="top" priority />
    </div>
  )
}
