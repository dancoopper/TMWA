import type { CSSProperties } from "react";
import {
    DEFAULT_EVENT_COLOR,
    EVENT_COLOR_KEYS,
    type EventColorKey,
} from "./models/Event";

export { DEFAULT_EVENT_COLOR, EVENT_COLOR_KEYS, type EventColorKey };

export type EventPaletteEntry = {
    key: EventColorKey;
    label: string;
    /** Solid swatch for the picker */
    swatch: string;
    /** Event card fill */
    bg: string;
    border: string;
    text: string;
    /** Month / list dot */
    dot: string;
};

export const EVENT_PALETTE: Record<EventColorKey, Omit<EventPaletteEntry, "key">> = {
    sage: {
        label: "Sage",
        swatch: "#7d8f5c",
        bg: "rgba(125, 143, 92, 0.28)",
        border: "rgba(90, 104, 68, 0.55)",
        text: "#3d472e",
        dot: "#6b7c52",
    },
    sky: {
        label: "Sky",
        swatch: "#4a8eb8",
        bg: "rgba(74, 142, 184, 0.22)",
        border: "rgba(45, 98, 132, 0.55)",
        text: "#1e4a63",
        dot: "#3a7aa0",
    },
    lavender: {
        label: "Lavender",
        swatch: "#8b7ab8",
        bg: "rgba(139, 122, 184, 0.22)",
        border: "rgba(88, 74, 124, 0.5)",
        text: "#453a5c",
        dot: "#7565a3",
    },
    coral: {
        label: "Coral",
        swatch: "#c96b5c",
        bg: "rgba(201, 107, 92, 0.22)",
        border: "rgba(150, 72, 60, 0.5)",
        text: "#5c2f28",
        dot: "#b85a4c",
    },
    amber: {
        label: "Amber",
        swatch: "#c9a032",
        bg: "rgba(201, 160, 50, 0.24)",
        border: "rgba(145, 112, 28, 0.55)",
        text: "#5c4514",
        dot: "#b8922a",
    },
    rose: {
        label: "Rose",
        swatch: "#b85c7a",
        bg: "rgba(184, 92, 122, 0.2)",
        border: "rgba(130, 56, 80, 0.5)",
        text: "#5c2838",
        dot: "#a64d68",
    },
    slate: {
        label: "Slate",
        swatch: "#64748b",
        bg: "rgba(100, 116, 139, 0.22)",
        border: "rgba(71, 85, 105, 0.55)",
        text: "#334155",
        dot: "#526077",
    },
    mist: {
        label: "Mist",
        swatch: "#8a8580",
        bg: "rgba(138, 133, 128, 0.28)",
        border: "rgba(100, 95, 90, 0.45)",
        text: "#3f3c38",
        dot: "#78736e",
    },
};

export const EVENT_PALETTE_LIST: EventPaletteEntry[] = (
    Object.entries(EVENT_PALETTE) as [EventColorKey, Omit<EventPaletteEntry, "key">][]
).map(([key, v]) => ({ key, ...v }));

export function normalizeEventColorKey(raw: string | null | undefined): EventColorKey {
    if (raw && (EVENT_COLOR_KEYS as readonly string[]).includes(raw)) {
        return raw as EventColorKey;
    }
    return DEFAULT_EVENT_COLOR;
}

export function eventCardStyle(colorKey: EventColorKey): CSSProperties {
    const c = EVENT_PALETTE[normalizeEventColorKey(colorKey)];
    return {
        backgroundColor: c.bg,
        borderColor: c.border,
        color: c.text,
    };
}
