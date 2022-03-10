import css from '@/components/common/ItemsCount.module.css'

export interface ItemsCountProps {
  count: number
}

export function ItemsCount(props: ItemsCountProps): JSX.Element {
  return <span className={css['text']}>({props.count})</span>
}
