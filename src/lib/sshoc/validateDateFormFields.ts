import type { DatasetCore, PublicationCore } from '@/api/sshoc'
import { isDate } from '@/modules/form/validate'

export function validateDateFormFields<T extends DatasetCore | PublicationCore>(
  values: Partial<T>,
  errors: Partial<Record<keyof typeof values, any>>,
): void {
  if (
    values.dateLastUpdated !== undefined &&
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    !isDate(values.dateLastUpdated!)
  ) {
    errors.dateLastUpdated = 'Must be a valid date.'
  }

  if (
    values.dateLastUpdated !== undefined &&
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    !isDate(values.dateLastUpdated!)
  ) {
    errors.dateLastUpdated = 'Must be a valid date.'
  }
}
