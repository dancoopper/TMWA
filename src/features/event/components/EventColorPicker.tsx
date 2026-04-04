import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { EVENT_PALETTE_LIST, type EventColorKey } from "@/features/event/eventColors";

type EventColorPickerProps = {
    value: EventColorKey;
    onChange: (key: EventColorKey) => void;
    disabled?: boolean;
    id?: string;
};

export function EventColorPicker({ value, onChange, disabled, id }: EventColorPickerProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-stone-700">
                Color
            </Label>
            <div
                id={id}
                className="flex flex-wrap gap-2"
                role="radiogroup"
                aria-label="Event color"
            >
                {EVENT_PALETTE_LIST.map(({ key, label, swatch }) => (
                    <button
                        key={key}
                        type="button"
                        role="radio"
                        aria-checked={value === key}
                        aria-label={label}
                        disabled={disabled}
                        onClick={() => onChange(key)}
                        className={cn(
                            "h-8 w-8 shrink-0 rounded-full border-2 border-stone-500/25 shadow-sm transition-all",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e7e2d4]",
                            "disabled:pointer-events-none disabled:opacity-40",
                            value === key
                                ? "ring-2 ring-offset-2 ring-offset-[#e7e2d4] ring-stone-700 scale-105"
                                : "hover:ring-1 hover:ring-stone-500/35 hover:ring-offset-1 hover:ring-offset-[#e7e2d4]",
                        )}
                        style={{ backgroundColor: swatch }}
                    />
                ))}
            </div>
        </div>
    );
}
