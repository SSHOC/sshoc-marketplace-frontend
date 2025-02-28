import Image from "next/legacy/image"

import css from '@/components/home/BackgroundImage.module.css'
import Clouds from '~/public/assets/images/backgrounds/home@2x.png'

export function BackgroundImage(): JSX.Element {
  return (
    <div className={css['container']}>
      <Image src={Clouds} alt="" layout="fill" objectFit="contain" objectPosition="top" priority />
    </div>
  )
}
