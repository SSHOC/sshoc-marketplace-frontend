import type { Mutation, MutationMeta, Query, QueryMeta } from "react-query";

export interface DefaultErrorMessageMap {
	query: {
		error: string;
	};
	mutation: {
		mutate: string;
		error: string;
		success: string;
	};
}

export interface QueryMetadata<TData = unknown, TError = unknown> extends QueryMeta {
	messages?: {
		error?: (error: TError, query: Query<TData, TError, TData>) => string | false | undefined;
	};
}

export interface MutationMetadata<
	TData = unknown,
	TError = unknown,
	TVariables = unknown,
	TContext = unknown,
> extends MutationMeta {
	messages?: {
		error?: (
			error: TError,
			variables: TVariables,
			context: TContext,
			mutation: Mutation<TData, TError, TVariables, TContext>,
		) => string | false | undefined;
		success?: (
			data: TData,
			variables: TVariables,
			context: TContext,
			mutation: Mutation<TData, TError, TVariables, TContext>,
		) => string | false | undefined;
		mutate?: (
			variables: TVariables,
			mutation: Mutation<TData, TError, TVariables, TContext>,
		) => string | false | undefined;
	};
}
