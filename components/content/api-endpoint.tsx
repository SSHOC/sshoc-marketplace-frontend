import { Button } from "@/lib/core/ui/Button/Button";
import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	type FormEvent,
	type ReactNode,
} from "react";
import { Item } from "@/lib/core/ui/Collection/Item";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";
import { assert, createUrl, createUrlSearchParams, request } from "@acdh-oeaw/lib";
import { baseUrl } from "@/config/sshoc.config";
import { useQuery } from "react-query";
import { CheckIcon, ClipboardIcon } from "lucide-react";
import { Select } from "@/lib/core/ui/Select/Select";
import type { Key } from "react-aria-components";
import { TextField } from "@/lib/core/ui/TextField/TextField";

type ApiParams = Record<string, Array<number | string> | number | string>;

interface ApiParamsContextValue {
	params: ApiParams;
	setParams: (updater: (params: ApiParams) => ApiParams) => void;
}

const ApiParamsContext = createContext<ApiParamsContextValue | null>(null);

interface ApiParamsProviderProps {
	children?: ReactNode;
	value: ApiParamsContextValue;
}

function ApiParamsProvider(props: Readonly<ApiParamsProviderProps>): ReactNode {
	const { children, value } = props;

	return <ApiParamsContext.Provider value={value}>{children}</ApiParamsContext.Provider>;
}

function useApiParams(): ApiParamsContextValue {
	const value = useContext(ApiParamsContext);

	assert(value != null);

	return value;
}

interface ApiEndpointProps {
	children?: ReactNode;
	pathname: string;
	title: string;
}

export function ApiEndpoint(props: Readonly<ApiEndpointProps>): ReactNode {
	const { children, pathname, title } = props;

	const [params, setParams] = useState({});

	const url = useMemo(() => {
		return String(
			createUrl({
				baseUrl,
				pathname,
				searchParams: createUrlSearchParams(params),
			}),
		);
	}, [pathname, params]);

	const result = useQuery(
		["api-documentation", url],
		() => {
			return request(url, { responseType: "json" });
		},
		{ enabled: false, keepPreviousData: true },
	);

	function onSubmit(event: FormEvent<HTMLFormElement>) {
		result.refetch();
		event.preventDefault();
	}

	const [isCopiedToClipboard, setCopiedToClipboard] = useState(false);

	function onCopy() {
		navigator.clipboard.writeText(String(url));
		setCopiedToClipboard(true);
	}

	useEffect(() => {
		let timer: ReturnType<typeof setTimeout> | null = null;

		if (isCopiedToClipboard === true) {
			timer = setTimeout(() => {
				setCopiedToClipboard(false);
				timer = null;
			}, 2000);
		}

		return () => {
			if (timer != null) {
				clearTimeout(timer);
			}
		};
	}, [isCopiedToClipboard]);

	return (
		<aside className="not-prose overflow-hidden rounded-sm border border-neutral-200">
			<strong className="flex border-b border-neutral-200 bg-neutral-75 px-4 py-2 text-md font-medium">
				{title}
			</strong>
			<form
				className="flex min-h-12 items-end justify-between gap-8 bg-neutral-50 px-4 py-3 [&_svg]:m-0!"
				onSubmit={onSubmit}
			>
				<div className="flex flex-1 flex-col flex-wrap items-center gap-4 *:w-auto! sm:flex-row">
					<ApiParamsProvider value={{ params, setParams }}>{children}</ApiParamsProvider>
				</div>
				<div className="flex items-center gap-4">
					<Button
						color="secondary"
						aria-disabled={result.isFetching}
						size="sm"
						// @ts-expect-error TODO: Replace with proper pending button.
						style={{ minWidth: 120 }}
						type="submit"
					>
						{result.isFetching ? <ProgressSpinner size="sm" /> : undefined}
						<span className={result.isFetching ? "sr-only" : undefined}>Refresh</span>
					</Button>
				</div>
			</form>
			<div className="flex items-center gap-2 border-t border-neutral-200 bg-neutral-50 px-4 py-2">
				<pre className="my-0! mr-2 flex-1 bg-transparent! p-2! pl-0! text-sm text-inherit!">
					{url}
				</pre>
				<button
					aria-label="Copy to clipboard"
					className="grid size-8 shrink-0 place-content-center place-items-center rounded-sm border border-neutral-200 bg-neutral-100 p-2 transition hover:bg-neutral-200 [&_svg]:m-0!"
					onClick={onCopy}
					title={isCopiedToClipboard ? "Copied" : "Copy to clipboard"}
					type="button"
				>
					{isCopiedToClipboard ? (
						<CheckIcon aria-hidden className="size-5 shrink-0" />
					) : (
						<ClipboardIcon aria-hidden className="size-5 shrink-0" />
					)}
				</button>
			</div>
			<div className="max-h-160 overflow-auto">
				{result.data != null ? (
					<div className="prose max-w-none">
						<pre className="m-0!">
							<code>{JSON.stringify(result.data, null, 2)}</code>
						</pre>
					</div>
				) : null}
			</div>
		</aside>
	);
}

interface ApiParamSelectProps {
	id: string;
	label: string;
	options: Array<{
		id: string;
		label: string;
	}>;
	placeholder: string;
}

export function ApiParamSelect(props: Readonly<ApiParamSelectProps>): ReactNode {
	const { id, label, placeholder, options } = props;

	const { params, setParams } = useApiParams();

	const value = params[id] as Key | undefined;

	function onChange(value: Key) {
		setParams((params) => {
			return { ...params, [id]: value };
		});
	}

	return (
		<Select
			label={label}
			placeholder={placeholder}
			size="sm"
			selectedKey={value}
			onSelectionChange={onChange}
		>
			{options.map((option) => {
				return <Item key={option.id}>{option.label}</Item>;
			})}
		</Select>
	);
}

interface ApiParamTextFieldProps {
	id: string;
	label: string;
	placeholder: string;
}

export function ApiParamTextField(props: Readonly<ApiParamTextFieldProps>): ReactNode {
	const { id, label, placeholder } = props;

	const { params, setParams } = useApiParams();

	const value = (params[id] as string | undefined) ?? "";

	function onChange(value: string) {
		setParams((params) => {
			return { ...params, [id]: value };
		});
	}

	return (
		<TextField
			label={label}
			placeholder={placeholder}
			size="sm"
			value={value}
			onChange={onChange}
		/>
	);
}
