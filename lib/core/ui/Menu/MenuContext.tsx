import type { FocusStrategy } from "@react-types/shared";
import type { HTMLAttributes, RefObject } from "react";
import { createContext } from "react";

export interface MenuContextValue extends Omit<HTMLAttributes<HTMLElement>, "autoFocus"> {
	onClose?: () => void;
	closeOnSelect?: boolean;
	shouldFocusWrap?: boolean;
	autoFocus?: FocusStrategy | boolean;
	ref: RefObject<HTMLUListElement | null>;
}

export const MenuContext = createContext<MenuContextValue | null>(null);
