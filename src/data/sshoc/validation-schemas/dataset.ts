import { isoDateString } from '@/data/sshoc/validation-schemas/common'
import { itemBaseInputSchema } from '@/data/sshoc/validation-schemas/item'

export const datasetInputSchema = itemBaseInputSchema.extend({
  dateCreated: isoDateString.optional(),
  dateLastUpdated: isoDateString.optional(),
})
