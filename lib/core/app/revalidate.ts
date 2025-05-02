import type { RequestOptions } from "@stefanprobst/request";
import { createUrl, request } from "@stefanprobst/request";

import { baseUrl } from "@/config/site.config";

export namespace Revalidate {
	export interface Body {
		pathname: string;
	}
	export interface Variables {
		data: Body;
	}
	export type Response = void;
}

export async function revalidate(data: Revalidate.Body): Promise<Revalidate.Response> {
	const url = createUrl({ pathname: "/api/revalidate", baseUrl });
	const options: RequestOptions = { method: "put", json: data };

	return request(url, options);
}
