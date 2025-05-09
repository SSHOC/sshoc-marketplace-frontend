/**
 * Note that validation assumes `isRequired: true`.
 *
 * @see https://github.com/Thinkmill/keystatic/issues/1261
 */

export const email = { regex: /.+?@.+?/, message: "Must be a valid email address." };

export const twitter = { regex: /^@.+/, message: "Must include the leading '@' character." };

export const urlFragment = { regex: /^#.+/, message: "Must include the leading '#' character." };

export const urlSearchParams = {
	regex: /^\?.+/,
	message: "Must include the leading '?' character.",
};

export const urlFragmentOptional = {
	regex: /^$|^#.+/,
	message: "Must include the leading '#' character.",
};

export const urlSearchParamsOptional = {
	regex: /^$|^\?.+/,
	message: "Must include the leading '?' character.",
};
