import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useCreateShare } from "@/features/share/hooks/useCreateShare";
import { Copy, Check, CalendarRange } from "lucide-react";

interface FindATimeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function FindATimeDialog({ open, onOpenChange }: FindATimeDialogProps) {
    const today = new Date().toISOString().split("T")[0];
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [label, setLabel] = useState("");
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const { createShare } = useCreateShare();

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate || !endDate) return;
        createShare.mutate(
            {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                label: label.trim() || undefined,
            },
            {
                onSuccess: ({ link }) => {
                    setGeneratedLink(link);
                },
            },
        );
    };

    const handleCopy = async () => {
        if (!generatedLink) return;
        await navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setStartDate(today);
            setEndDate(today);
            setLabel("");
            setGeneratedLink(null);
        }
        onOpenChange(open);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[420px] border-stone-400/50 bg-[#e7e2d4] text-stone-800">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-stone-800">
                        <CalendarRange className="w-4 h-4 text-[#8d9b67]" />
                        Find a Time
                    </DialogTitle>
                    <DialogDescription className="text-stone-600">
                        Share your free slots for a date range. The recipient can pick any open hour and book it.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleGenerate} className="space-y-4 pt-1">
                    {/* Label */}
                    <div className="space-y-1.5">
                        <Label className="text-stone-700">Label (optional)</Label>
                        <Input
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="e.g. Coffee chat"
                            disabled={createShare.isPending}
                            className="border-stone-400/50 bg-[#efe9dc] text-stone-800 placeholder:text-stone-500 focus-visible:ring-sky-500/25"
                        />
                    </div>

                    {/* Date range */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-stone-700">From</Label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                disabled={createShare.isPending}
                                required
                                className="border-stone-400/50 bg-[#efe9dc] text-stone-800 focus-visible:ring-sky-500/25"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-stone-700">To</Label>
                            <Input
                                type="date"
                                value={endDate}
                                min={startDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                disabled={createShare.isPending}
                                required
                                className="border-stone-400/50 bg-[#efe9dc] text-stone-800 focus-visible:ring-sky-500/25"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={createShare.isPending || !startDate || !endDate}
                        className="w-full"
                    >
                        {createShare.isPending ? "Generating…" : "Generate Link"}
                    </Button>
                </form>

                {/* Generated link */}
                {generatedLink && (
                    <div className="mt-2 space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                            Share this link
                        </p>
                        <div className="flex items-center gap-2">
                            <Input
                                readOnly
                                value={generatedLink}
                                onClick={(e) => (e.target as HTMLInputElement).select()}
                                className="border-stone-400/50 bg-[#efe9dc] text-stone-800 text-xs focus-visible:ring-sky-500/25"
                            />
                            <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                onClick={handleCopy}
                                title="Copy link"
                                className="shrink-0 border-stone-400/50 bg-[#efe9dc] text-stone-700 hover:bg-stone-300/60"
                            >
                                {copied ? (
                                    <Check className="w-4 h-4 text-[#8d9b67]" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                        <p className="text-[11px] text-stone-500">
                            Anyone with this link can view your free slots and book a 1-hour block (9 AM – 5 PM).
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
