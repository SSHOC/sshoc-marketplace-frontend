"use client";

import { debounce } from "@acdh-oeaw/lib";
import { useEffectEvent } from "@react-aria/utils";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Underline from "@tiptap/extension-underline";
import { type Editor, EditorContent, type JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";
import { type ReactNode, useMemo } from "react";
import { Group, Toolbar } from "react-aria-components";

import { ToggleIconButton } from "@/components/ui/toggle-icon-button";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";

interface RichTextEditorProps {
	defaultValue?: string;
	onChange?: (value: JSONContent) => void;
}

export function RichTextEditor(props: Readonly<RichTextEditorProps>): ReactNode {
	const { defaultValue, onChange } = props;

	const _onChange = useEffectEvent(onChange);
	// const onChangeDebounced = useMemo(() => {
	// 	return debounce(_onChange, 150);
	// }, [_onChange]);

	const editor = useEditor({
		content: defaultValue,
		editorProps: {
			attributes: {
				class:
					"prose min-h-12 w-full rounded-sm border border-neutral-250 bg-neutral-50 p-2 px-4 py-3 text-base text-neutral-800 transition hover:border-brand-600 hover:bg-neutral-0 focus:border-brand-600 focus:bg-brand-50 focus:outline-2 focus:outline-brand-600 focus-visible:outline-2 disabled:cursor-not-allowed disabled:border-neutral-100 disabled:text-neutral-500 forced-colors:border-[ButtonBorder] forced-colors:focus:border-[Highlight] forced-colors:disabled:border-[GrayText]",
				spellcheck: "false",
			},
		},
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [2, 3, 4],
				},
			}),
			Underline,
			Link.configure({
				autolink: true,
				defaultProtocol: "https",
				openOnClick: false,
				protocols: ["http", "https", "mailto"],
			}),
			Table.configure({
				resizable: true,
			}),
			TableRow,
			TableHeader,
			TableCell,
		],
		immediatelyRender: false,
		// onBlur({ editor }) {
		// 	onChangeDebounced(editor.getJSON());
		// },
		// onUpdate({ editor }) {
		// 	onChangeDebounced(editor.getJSON());
		// },
		shouldRerenderOnTransaction: false,
	});

	return (
		<div>
			<MenuBar editor={editor} />
			<EditorContent editor={editor} />
		</div>
	);
}

interface MenuBarProps {
	editor: Editor | null;
}

function MenuBar(props: Readonly<MenuBarProps>): ReactNode {
	const { editor } = props;

	if (!editor) {
		return null;
	}

	return (
		<div>
			<Toolbar className="flex flex-wrap gap-x-4 rounded-sm py-2">
				<Group className="flex flex-wrap gap-x-2">
					<TooltipTrigger>
						<ToggleIconButton
							isDisabled={!editor.can().chain().focus().toggleBold().run()}
							isSelected={editor.isActive("bold")}
							label={"Bold"}
							onChange={() => {
								editor.chain().focus().toggleBold().run();
							}}
							size="small"
						>
							<BoldIcon aria-hidden={true} data-slot="icon" />
						</ToggleIconButton>
						<Tooltip>{"Bold"}</Tooltip>
					</TooltipTrigger>

					<TooltipTrigger>
						<ToggleIconButton
							isDisabled={!editor.can().chain().focus().toggleItalic().run()}
							isSelected={editor.isActive("italic")}
							label={"Italic"}
							onChange={() => {
								editor.chain().focus().toggleItalic().run();
							}}
							size="small"
						>
							<ItalicIcon aria-hidden={true} data-slot="icon" />
						</ToggleIconButton>
						<Tooltip>{"Italic"}</Tooltip>
					</TooltipTrigger>

					<TooltipTrigger>
						<ToggleIconButton
							isDisabled={!editor.can().chain().focus().toggleUnderline().run()}
							isSelected={editor.isActive("underline")}
							label={"Underline"}
							onChange={() => {
								editor.chain().focus().toggleUnderline().run();
							}}
							size="small"
						>
							<UnderlineIcon aria-hidden={true} data-slot="icon" />
						</ToggleIconButton>
						<Tooltip>{"Underline"}</Tooltip>
					</TooltipTrigger>
				</Group>
			</Toolbar>
		</div>
	);
}
