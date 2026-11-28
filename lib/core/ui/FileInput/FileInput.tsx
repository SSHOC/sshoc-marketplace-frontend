import css from "@/lib/core/ui/Button/Button.module.css";
import fieldCss from "@/lib/core/ui/Field/Field.module.css";

import type { FocusEvents } from "@react-types/shared";
import type { AriaTextFieldProps } from "@react-types/textfield";
import { useTranslations } from "next-intl";
import { forwardRef, useId, useRef, useState, type ForwardedRef, type ReactNode } from "react";
import { Button, Input } from "react-aria-components";

import type { ButtonProps } from "@/lib/core/ui/Button/Button";
import { HelpText } from "@/lib/core/ui/HelpText/HelpText";

export type AllowedFileTypes = "all" | "image" | "video";

export interface FileInputProps
	extends
		Omit<AriaTextFieldProps, "onChange" | "value" | "errorMessage" | keyof FocusEvents<Element>>,
		FocusEvents<Element> {
	errorMessage?: ReactNode;
	color?: ButtonProps["color"];
	fileTypes?: Array<AllowedFileTypes>;
	/** @default false */
	multiple?: boolean;
	onChange?: (fileList: FileList | null) => void;
}

const mimeTypes = { all: "*/*", image: "image/*", video: "video/*" };

export const FileInput = forwardRef(function FileInput(
	props: FileInputProps,
	ref: ForwardedRef<HTMLDivElement>,
): ReactNode {
	const t = useTranslations();
	const [fileList, setFileList] = useState<FileList | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const descriptionId = useId();
	const errorId = useId();
	const {
		autoFocus,
		color = "gradient",
		description,
		errorMessage,
		fileTypes = ["all"],
		form,
		id,
		isDisabled,
		isReadOnly,
		isRequired,
		label = t("common.select-file"),
		multiple = false,
		name,
		onBlur,
		onChange,
		onFocus,
		onFocusChange,
		onKeyDown,
		onKeyUp,
		validationState,
	} = props;
	const isInvalid = props.isInvalid || validationState === "invalid";
	const describedBy = [
		props["aria-describedby"],
		description ? descriptionId : null,
		isInvalid && errorMessage ? errorId : null,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div ref={ref} className={fieldCss["field"]}>
			<div>
				<Button
					id={id}
					name={name}
					form={form}
					autoFocus={autoFocus}
					className={css["button"]}
					data-color={color}
					data-size="md"
					data-variant="fill"
					isDisabled={isDisabled || isReadOnly}
					aria-label={props["aria-label"]}
					aria-labelledby={props["aria-labelledby"]}
					aria-describedby={describedBy || undefined}
					onFocus={onFocus}
					onBlur={onBlur}
					onFocusChange={onFocusChange}
					onKeyDown={onKeyDown}
					onKeyUp={onKeyUp}
					onPress={() => inputRef.current?.click()}
				>
					{label}
				</Button>
				{/* Retain a named native input so files are also available to FormData. */}
				<Input
					ref={inputRef}
					type="file"
					hidden
					name={name}
					form={form}
					disabled={isDisabled}
					multiple={multiple}
					accept={fileTypes.map((type) => mimeTypes[type]).join(", ")}
					required={isRequired && props.validationBehavior === "native" && !isReadOnly}
					onChange={(event) => {
						const files = event.currentTarget.files;
						setFileList(files);
						onChange?.(files);
					}}
				/>
				{fileList != null && fileList.length > 0 ? (
					<ul role="list">
						{Array.from(fileList, (file, index) => (
							<li key={`${file.name}-${index}`}>
								{file.name} ({Math.round(file.size / 1024)} kb)
							</li>
						))}
					</ul>
				) : null}
				{description || (isInvalid && errorMessage) ? (
					<HelpText
						description={description}
						descriptionProps={{ id: descriptionId }}
						errorMessage={errorMessage}
						errorMessageProps={{ id: errorId }}
						validationState={isInvalid ? "invalid" : validationState}
						isDisabled={isDisabled}
					/>
				) : null}
			</div>
		</div>
	);
});
