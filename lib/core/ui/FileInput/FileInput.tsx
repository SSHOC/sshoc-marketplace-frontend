import { useFocusRing } from "@react-aria/focus";
import { useHover } from "@react-aria/interactions";
import { useTextField } from "@react-aria/textfield";
import { mergeProps } from "@react-aria/utils";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import type { AriaTextFieldProps } from "@react-types/textfield";
import { useTranslations } from "next-intl";
import type { ChangeEvent, ForwardedRef, ReactNode } from "react";
import { forwardRef, Fragment, useRef, useState } from "react";

import type { ButtonProps } from "@/lib/core/ui/Button/Button";
import { Button } from "@/lib/core/ui/Button/Button";
import { Field } from "@/lib/core/ui/Field/Field";

export type AllowedFileTypes = "all" | "image" | "video";

export interface FileInputProps extends Omit<AriaTextFieldProps, "onChange" | "value"> {
	color?: ButtonProps["color"];
	fileTypes?: Array<AllowedFileTypes>;
	/** @default false */
	multiple?: boolean;
	// label?: ReactNode
	onChange?: (fileList: FileList | null) => void;
}

// TODO: Use File System Access API once Firefox has support.
export const FileInput = forwardRef(function FileInput(
	props: FileInputProps,
	forwardedRef: ForwardedRef<HTMLDivElement>,
): ReactNode {
	const t = useTranslations();
	const [fileList, setFileList] = useState<FileList | null>(null);

	const {
		fileTypes = ["all"],
		color = "gradient",
		label = t("common.select-file"),
		multiple = false,
		onChange,
		/**
		 * `<input type="file" />` elements are uncontrolled in React.
		 *
		 * @see https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag
		 */
		/* @ts-expect-error Uncontrolled element. */
		value /* eslint-disable-line @typescript-eslint/no-unused-vars */,
		...textFieldProps
	} = props;

	const accept = fileTypes
		.map((fileType) => {
			switch (fileType) {
				case "all":
					return "*/*";
				case "image":
					return "image/*";
				case "video":
					return "video/*";
			}
		})
		.join(", ");

	function onChangeFileList(event: ChangeEvent<HTMLInputElement>) {
		const fileList = event.currentTarget.files;

		setFileList(fileList);

		onChange?.(fileList);
	}

	const fieldRef = forwardedRef;
	const inputRef = useRef<HTMLInputElement>(null);
	const { descriptionProps, errorMessageProps, inputProps, labelProps } = useTextField(
		{ ...textFieldProps, label },
		inputRef,
	);

	const { focusProps } = useFocusRing({ ...props, isTextInput: true });
	const { hoverProps } = useHover(props);

	const labelButton = (
		<Button color={color} elementType="span">
			{label}
		</Button>
	);

	return (
		<Field
			ref={fieldRef}
			{...props}
			label={labelButton}
			descriptionProps={descriptionProps}
			errorMessageProps={errorMessageProps}
			labelProps={labelProps}
			showErrorIcon={false}
		>
			<Fragment>
				<VisuallyHidden>
					<input
						ref={inputRef}
						{...mergeProps(focusProps, hoverProps, inputProps)}
						accept={accept}
						multiple={multiple}
						onChange={onChangeFileList}
						type="file"
						// `<input type="file" />` elements are uncontrolled in React.
						value={undefined}
					/>
				</VisuallyHidden>
				{fileList != null && fileList.length > 0 ? (
					<ul role="list">
						{Array.from(fileList).map((file) => {
							return (
								<li key={file.name}>
									{file.name} ({Math.round(file.size / 1024)} kb)
								</li>
							);
						})}
					</ul>
				) : null}
			</Fragment>
		</Field>
	);
});
