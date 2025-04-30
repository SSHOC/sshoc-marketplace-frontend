export type PaginatedRequest<T> = T & {
	page?: number;
	perpage?: number;
};

export type PaginatedResponse<T> = T & {
	hits: number;
	count: number;
	page: number;
	perpage: number;
	pages: number;
};

export interface AuthData {
	token: string | null;
}

export type FacetValue<T> = T & {
	count: number;
	checked: boolean;
};
