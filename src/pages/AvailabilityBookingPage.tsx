import { useState } from "react";
import { useParams } from "react-router-dom";
import { useFindATime, type FreeSlot } from "@/features/share/hooks/useFindATime";
import { useBookSlot } from "@/features/share/hooks/useBookSlot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarCheck, Clock, CheckCircle } from "lucide-react";

function formatSlotTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDayHeading(date: Date): string {
    return date.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
}

function groupSlotsByDay(slots: FreeSlot[]): Map<string, FreeSlot[]> {
    const map = new Map<string, FreeSlot[]>();
    for (const slot of slots) {
        const key = slot.start.toDateString();
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(slot);
    }
    return map;
}

export default function AvailabilityBookingPage() {
    const { shareId } = useParams<{ shareId: string }>();
    const { data: slots = [], isLoading, isError } = useFindATime(shareId);
    const { bookSlot } = useBookSlot(shareId ?? "");

    const [selectedSlot, setSelectedSlot] = useState<FreeSlot | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [confirmedSlot, setConfirmedSlot] = useState<FreeSlot | null>(null);

    const handleBook = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSlot || !name.trim() || !email.trim()) return;
        bookSlot.mutate(
            {
                bookerName: name.trim(),
                bookerEmail: email.trim(),
                slotStart: selectedSlot.start,
                slotEnd: selectedSlot.end,
            },
            {
                onSuccess: () => {
                    setConfirmedSlot(selectedSlot);
                    setSelectedSlot(null);
                    setName("");
                    setEmail("");
                },
            },
        );
    };

    const grouped = groupSlotsByDay(slots.filter((s) => !s.isBooked));
    const freeCount = slots.filter((s) => !s.isBooked).length;

    // ── Confirmed screen ──────────────────────────────────────────────
    if (confirmedSlot) {
        return (
            <div className="min-h-screen bg-[#f0ebe0] flex items-center justify-center p-6">
                <div className="bg-[#e7e2d4] border border-stone-400/40 rounded-2xl shadow-lg max-w-md w-full p-8 text-center space-y-4">
                    <CheckCircle className="w-12 h-12 text-[#8d9b67] mx-auto" />
                    <h1 className="text-xl font-semibold text-stone-800">You're booked!</h1>
                    <p className="text-stone-600 text-sm">
                        Your slot has been confirmed for{" "}
                        <strong>
                            {formatDayHeading(confirmedSlot.start)} · {formatSlotTime(confirmedSlot.start)}–{formatSlotTime(confirmedSlot.end)}
                        </strong>
                        . The organiser will be in touch.
                    </p>
                </div>
            </div>
        );
    }

    // ── Loading / error ───────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f0ebe0] flex items-center justify-center">
                <div className="space-y-3 w-72">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-10 bg-stone-300/50 animate-pulse rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (isError || !shareId) {
        return (
            <div className="min-h-screen bg-[#f0ebe0] flex items-center justify-center p-6">
                <div className="text-center space-y-2">
                    <p className="text-stone-700 font-medium">This link is invalid or has expired.</p>
                    <p className="text-stone-500 text-sm">Please ask the organiser to send a new one.</p>
                </div>
            </div>
        );
    }

    // ── Main booking UI ───────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#f0ebe0] py-10 px-4">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-1">
                    <div className="flex items-center justify-center gap-2 text-[#8d9b67] mb-2">
                        <CalendarCheck className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-semibold text-stone-800">Pick a Time</h1>
                    <p className="text-stone-500 text-sm">
                        {freeCount === 0
                            ? "No free slots available in this range."
                            : `${freeCount} slot${freeCount > 1 ? "s" : ""} available — choose one below.`}
                    </p>
                </div>

                {/* Slot grid */}
                {grouped.size === 0 ? (
                    <div className="text-center text-stone-500 text-sm py-12">
                        All slots have been booked or no availability was found.
                    </div>
                ) : (
                    Array.from(grouped.entries()).map(([dayKey, daySlots]) => (
                        <div key={dayKey} className="space-y-2">
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-500 px-1">
                                {formatDayHeading(daySlots[0].start)}
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {daySlots.map((slot) => {
                                    const isSelected =
                                        selectedSlot?.start.toISOString() === slot.start.toISOString();
                                    return (
                                        <button
                                            key={slot.start.toISOString()}
                                            type="button"
                                            onClick={() => setSelectedSlot(isSelected ? null : slot)}
                                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 ${
                                                isSelected
                                                    ? "bg-[#8d9b67] text-white border-[#8d9b67] shadow-md scale-[1.02]"
                                                    : "bg-[#e7e2d4] border-stone-400/40 text-stone-700 hover:bg-stone-300/60 hover:border-stone-400"
                                            }`}
                                        >
                                            <Clock className="w-3.5 h-3.5 shrink-0" />
                                            {formatSlotTime(slot.start)}–{formatSlotTime(slot.end)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}

                {/* Booking form (appears when a slot is selected) */}
                {selectedSlot && (
                    <div className="bg-[#e7e2d4] border border-stone-400/40 rounded-2xl shadow p-6 space-y-4">
                        <p className="text-sm font-semibold text-stone-800">
                            Booking:{" "}
                            <span className="text-[#8d9b67]">
                                {formatDayHeading(selectedSlot.start)} · {formatSlotTime(selectedSlot.start)}–{formatSlotTime(selectedSlot.end)}
                            </span>
                        </p>
                        <form onSubmit={handleBook} className="space-y-3">
                            <div className="space-y-1.5">
                                <Label className="text-stone-700">Your name</Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Jane Smith"
                                    required
                                    disabled={bookSlot.isPending}
                                    className="border-stone-400/50 bg-[#efe9dc] text-stone-800 placeholder:text-stone-500 focus-visible:ring-sky-500/25"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-stone-700">Your email</Label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="jane@example.com"
                                    required
                                    disabled={bookSlot.isPending}
                                    className="border-stone-400/50 bg-[#efe9dc] text-stone-800 placeholder:text-stone-500 focus-visible:ring-sky-500/25"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setSelectedSlot(null)}
                                    disabled={bookSlot.isPending}
                                    className="flex-1 border-stone-400/50 bg-[#efe9dc] text-stone-700 hover:bg-stone-300/60"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={bookSlot.isPending || !name.trim() || !email.trim()}
                                    className="flex-1 bg-[#8d9b67] hover:bg-[#7a8a58] text-white"
                                >
                                    {bookSlot.isPending ? "Booking…" : "Confirm Booking"}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
