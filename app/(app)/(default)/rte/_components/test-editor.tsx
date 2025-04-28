"use client";

import Underline from "@tiptap/extension-underline";
import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BoldIcon, CodeIcon, ItalicIcon, UnderlineIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Group, Toolbar } from "react-aria-components";

import { ToggleIconButton } from "@/components/ui/toggle-icon-button";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";

interface TestEditorProps {
	defaultValue?: string;
	onChange?: (content: any) => string;
}

export function TestEditor(props: Readonly<TestEditorProps>): ReactNode {
	const { defaultValue, onChange } = props;

	const editor = useEditor({
		content: "<p>This is a test!</p>",
		extensions: [StarterKit, Underline],
		editorProps: {
			attributes: {
				class: "border border-neutral-250 rounded-sm bg-neutral-50 py-3 px-4",
				spellcheck: "false",
			},
		},
		immediatelyRender: false,
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
		<Toolbar className="flex gap-x-4">
			<Group className="flex gap-x-2">
				<TooltipTrigger>
					<ToggleIconButton
						isDisabled={editor.isActive("codeBlock") || !editor.can().toggleBold()}
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
						isDisabled={editor.isActive("codeBlock") || !editor.can().toggleItalic()}
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
						isDisabled={editor.isActive("codeBlock") || !editor.can().toggleUnderline()}
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

				<TooltipTrigger>
					<ToggleIconButton
						isDisabled={editor.isActive("codeBlock") || !editor.can().toggleCode()}
						isSelected={editor.isActive("code")}
						label={"Code"}
						onChange={() => {
							editor.chain().focus().toggleCode().run();
						}}
						size="small"
					>
						<CodeIcon aria-hidden={true} data-slot="icon" />
					</ToggleIconButton>
					<Tooltip>{"Code"}</Tooltip>
				</TooltipTrigger>
			</Group>
		</Toolbar>
	);
}
