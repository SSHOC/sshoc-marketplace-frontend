import type { ListState } from "@react-stately/list";
import { createContext } from "react";

export const ListBoxContext = createContext<ListState<unknown> | null>(null);
