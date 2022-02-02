import type { FieldStatus } from './types'

export interface DiffControlsProps {
  status: FieldStatus
  onApprove: () => void
  onReject: () => void
}

export function DiffControls(props: DiffControlsProps): JSX.Element {
  const { status, onApprove, onReject } = props

  const action = getAction(status)

  return (
    <div className="z-10 flex flex-wrap items-center justify-end gap-2 text-sm bg-white">
      <span className="border-[#E4EFFD] border bg-[#EAFBFF] text-[#656565] rounded px-4 py-1 select-none text-center">
        {action}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={onApprove}
          type="button"
          className='className="border-[#D8D8D8] border text-[#045A92] bg-white rounded px-4 py-1 hover:bg-[#EAFCE4] hover:border-[#82E071] hover:text-neutral-800"'
        >
          Approve
        </button>
        <button
          onClick={onReject}
          type="button"
          className='className="border-[#D8D8D8] border text-[#045A92] bg-white rounded px-4 py-1 hover:bg-[#FFEAEA] hover:border-[#FFB9B9] hover:text-neutral-800"'
        >
          Reject
        </button>
      </div>
    </div>
  )
}

function getAction(status: FieldStatus): string {
  switch (status) {
    case 'deleted':
      return 'Suggested deletion'
    case 'inserted':
      return 'Suggested insertion'
    case 'changed':
      return 'Suggested change'
    default:
      return ''
  }
}
