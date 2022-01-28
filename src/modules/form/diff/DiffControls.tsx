import cx from 'clsx'
import type { ReactNode } from 'react'

import type { Status } from '@/modules/form/diff/useDiffState'

export function DiffControls({
  onApprove,
  onReject,
  children,
  status,
  variant,
}: {
  onApprove: () => void
  onReject: () => void
  children: ReactNode
  status: Status
  /** @default 'input' */
  variant?: 'input' | 'media'
}): JSX.Element {
  return (
    <div
      className={cx(
        'relative flex flex-col flex-1 bg-[#fafeff] -mx-4 px-4 py-4 z-10 rounded',
        variant !== 'media' && 'space-y-2',
      )}
    >
      <div
        className={cx(
          'z-10 flex flex-wrap items-center justify-end space-x-2 text-sm bg-white gap-y-1',
          variant !== 'media' ? 'absolute right-1.5 top-1.5' : 'px-2',
        )}
      >
        <div className="border-[#E4EFFD] border bg-[#EAFBFF] text-[#656565] rounded px-4 py-1 select-none text-center">
          Suggested{' '}
          {status === 'inserted'
            ? 'Insertion'
            : status === 'deleted'
            ? 'Deletion'
            : 'Change'}
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onApprove}
            className="border-[#D8D8D8] border text-[#045A92] bg-white rounded px-4 py-1 hover:bg-[#EAFCE4] hover:border-[#82E071] hover:text-neutral-900"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={onReject}
            className="border-[#D8D8D8] border text-[#045A92] bg-white rounded px-4 py-1 hover:bg-[#FFEAEA] hover:border-[#FFB9B9] hover:text-neutral-900"
          >
            Reject
          </button>
        </div>
      </div>
      {children}
    </div>
  )
}
