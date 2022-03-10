import { Prose } from '@/components/common/Prose'
import css from '@/components/item/ItemDescription.module.css'
import { useMarkdownSync } from '@/lib/utils/hooks'

export interface ItemDescriptionProps {
  description: string
}

export function ItemDescription(props: ItemDescriptionProps): JSX.Element {
  const element = useMarkdownSync({ markdown: props.description })

  return (
    <div className={css['container']}>
      <Prose>{element}</Prose>
    </div>
  )
}
