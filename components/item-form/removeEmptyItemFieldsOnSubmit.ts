import type { ItemInput } from "@/data/sshoc/api/item";
import { removeEmptyItemFields } from "@/data/sshoc/utils/removeEmptyItemFields";

export function removeEmptyItemFieldsOnSubmit<T extends ItemInput>(values: T): T {
	/**
	 * We allow submitting with empty fields, because we pre-populate the "create new item" forms
	 * with empty recommended fields, and users should be able to (i) see regular error messages
	 * when the field is touched and blurred, bur (ii) still be able to submit without having to
	 * manually delete all empty fields.
	 *
	 * Therefore we run an additional validation step with sanitized fields to clear out all
	 * unnecessary field errors before submit. Note that when using the zod schema in the
	 * actual request handlers, we *also* need to remove those empty fields. So this will run twice,
	 * but is cheap.
	 */
	if ("__submitting__" in values) {
		// delete values['__submitting__']
		return removeEmptyItemFields(values);
	}

	return values;
}
