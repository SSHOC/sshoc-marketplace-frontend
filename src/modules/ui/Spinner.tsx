import cx from 'clsx'

export default function Spinner({ className }: { className?: string }): JSX.Element {
  return (
    <div
      className={cx(
        'inline-block rounded-full border-b-4 border-l-4 border-current animate-spin',
        className,
      )}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}
