export default function FormFieldErrorMessage({
  message,
}: {
  message?: string
}): JSX.Element | null {
  if (message === undefined) return null
  return (
    <span role="alert" className="text-error-600">
      {message}
    </span>
  )
}
