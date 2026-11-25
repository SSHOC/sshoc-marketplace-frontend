import type {
	AfterResponseHook,
	BeforeRequestHook,
	RequestOptions,
	UrlInit,
} from "@stefanprobst/request";
import { createUrl as _createUrl, request as _request } from "@stefanprobst/request";

import { baseUrl } from "@/config/sshoc.config";
import type { AuthData } from "@/data/sshoc/api/common";

const defaultReponseType = "json" as const;

type QueryValue = string | number | boolean | null | undefined;
type QueryParams<T> = { [K in keyof T]: QueryValue | Array<QueryValue> };

export const createUrl = <T extends QueryParams<T>>(
	init: Omit<UrlInit, "baseUrl" | "searchParams"> & { searchParams?: T },
): URL => {
	const searchParams: Record<string, QueryValue | Array<QueryValue>> = {};
	for (const key in init.searchParams) {
		searchParams[key] = init.searchParams[key];
	}
	return _createUrl({ ...init, baseUrl, searchParams });
};

export const request = (
	input: Request | URL,
	init: RequestOptions,
	auth?: AuthData,
): ReturnType<typeof _request> => {
	const options = {
		responseType: defaultReponseType,
		...init,
		auth: auth?.token == null ? undefined : { token: auth.token },
	};

	/**
	 * Avoid sending empty query params.
	 * `request` will filter out nullish values and empty arrays, but not empty strings.
	 * We do this mostly, because the backend currently crashes when we send empty query
	 * params on a dynamic property query.
	 */
	if (input instanceof URL) {
		const searchParams = new URLSearchParams(input.searchParams);
		searchParams.forEach((value, key) => {
			if (value === "") {
				input.searchParams.delete(key);
			}
		});
	}

	return _request(input, options);
};

export type { AfterResponseHook, BeforeRequestHook, RequestOptions };

// TODO: `useRequest` which adds token from auth context provider,
// to avoid manually adding the token in every single hook.
