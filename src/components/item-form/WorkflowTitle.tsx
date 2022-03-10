import css from '@/components/item-form/WorkflowTitle.module.css'
import { useFieldState } from '@/lib/core/form/useFieldState'

export function WorkflowTitle(): JSX.Element {
  const title = useFieldState<string>('label').input.value

  return <h2 className={css['workflow-title']}>{title}</h2>
}
