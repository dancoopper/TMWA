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
import { useWorkspaceMembers } from "@/features/share/hooks/useWorkspaceMembers";
import { useShareWorkspace } from "@/features/share/hooks/useShareWorkspace";
import { useAuthStore } from "@/stores/authStore";
import { UserMinus, Eye, Pencil, EyeOff, CalendarSearch } from "lucide-react";
import FindATimeDialog from "@/features/share/components/FindATimeDialog";

interface ShareWorkspaceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ShareWorkspaceDialog({ open, onOpenChange }: ShareWorkspaceDialogProps) {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<"viewer" | "editor">("viewer");
    const [hideEvents, setHideEvents] = useState(false);
    const [findATimeOpen, setFindATimeOpen] = useState(false);

    const { data: members = [], isLoading } = useWorkspaceMembers();
    const { invite, updateMember, removeMember } = useShareWorkspace();
    const currentUserId = useAuthStore((s) => s.session?.user.id);

    const isPending = invite.isPending;

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        invite.mutate(
            { email, role, hideEvents },
            {
                onSuccess: () => {
                    setEmail("");
                    setRole("viewer");
                    setHideEvents(false);
                },
            },
        );
    };

    const displayName = (firstName: string | null, lastName: string | null, userId: string) => {
        if (firstName || lastName) return [firstName, lastName].filter(Boolean).join(" ");
        return userId.slice(0, 8) + "…";
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[460px] border-stone-400/50 bg-[#e7e2d4] text-stone-800">
                    <DialogHeader>
                        <DialogTitle className="text-stone-800">Share Workspace</DialogTitle>
                        <DialogDescription className="text-stone-600">
                            Invite people by email and manage their access.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Invite form */}
                    <form onSubmit={handleInvite} className="space-y-3 pt-1">
                        <div className="space-y-1.5">
                            <Label htmlFor="invite-email" className="text-stone-700">Email address</Label>
                            <Input
                                id="invite-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="colleague@example.com"
                                disabled={isPending}
                                autoFocus
                                className="border-stone-400/50 bg-[#efe9dc] text-stone-800 placeholder:text-stone-500 focus-visible:ring-sky-500/25"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Role */}
                            <div className="space-y-1.5">
                                <Label className="text-stone-700">Permission</Label>
                                <div className="flex bg-stone-400/30 rounded-full p-0.5 w-fit">
                                    <button
                                        type="button"
                                        onClick={() => setRole("viewer")}
                                        disabled={isPending}
                                        className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full transition-all duration-200 ${
                                            role === "viewer"
                                                ? "bg-stone-700 text-white shadow-sm"
                                                : "text-stone-600 hover:text-stone-800"
                                        }`}
                                    >
                                        <Eye className="w-3 h-3" /> View
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRole("editor")}
                                        disabled={isPending}
                                        className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full transition-all duration-200 ${
                                            role === "editor"
                                                ? "bg-stone-700 text-white shadow-sm"
                                                : "text-stone-600 hover:text-stone-800"
                                        }`}
                                    >
                                        <Pencil className="w-3 h-3" /> Edit
                                    </button>
                                </div>
                            </div>

                            {/* Hide events */}
                            <div className="space-y-1.5">
                                <Label className="text-stone-700">Privacy</Label>
                                <label className="flex items-center gap-2 cursor-pointer mt-1.5">
                                    <input
                                        type="checkbox"
                                        checked={hideEvents}
                                        onChange={(e) => setHideEvents(e.target.checked)}
                                        disabled={isPending}
                                        className="accent-[#8d9b67] w-3.5 h-3.5"
                                    />
                                    <span className="text-[11px] text-stone-600 flex items-center gap-1">
                                        <EyeOff className="w-3 h-3" /> Hide my events
                                    </span>
                                </label>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isPending || !email.trim()}
                            className="w-full"
                        >
                            {isPending ? "Inviting…" : "Invite"}
                        </Button>
                    </form>

                    {/* Find a Time */}
                    <div className="border-t border-stone-400/30 pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setFindATimeOpen(true)}
                            className="w-full flex items-center gap-2 border-stone-400/50 bg-[#efe9dc] text-stone-700 hover:bg-stone-300/60 hover:text-stone-900"
                        >
                            <CalendarSearch className="w-4 h-4 text-[#8d9b67]" />
                            Find a Time
                        </Button>
                        <p className="text-[10px] text-stone-500 text-center mt-1">
                            Share your free slots and let someone book a 1-hour block.
                        </p>
                    </div>

                    {/* Current members list */}
                    <div className="mt-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-2">
                            Members
                        </p>
                        {isLoading ? (
                            <div className="space-y-2">
                                {[1, 2].map((i) => (
                                    <div key={i} className="h-8 bg-stone-300/40 animate-pulse rounded-md" />
                                ))}
                            </div>
                        ) : members.length === 0 ? (
                            <p className="text-xs text-stone-500 italic">No members yet.</p>
                        ) : (
                            <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                {members.map((member) => {
                                    const isMe = member.userId === currentUserId;
                                    return (
                                        <li
                                            key={member.id}
                                            className="flex items-center justify-between gap-2 rounded-md bg-stone-300/30 px-3 py-1.5"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-stone-800 truncate">
                                                    {displayName(member.firstName, member.lastName, member.userId)}
                                                    {isMe && <span className="ml-1 text-stone-500">(you)</span>}
                                                </p>
                                                <p className="text-[10px] text-stone-500">
                                                    {member.isOwner ? "Owner" : member.role}
                                                    {member.hideEvents && " · events hidden"}
                                                </p>
                                            </div>

                                            {/* Controls — only for non-owner non-self members */}
                                            {!member.isOwner && !isMe && (
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    {/* Role toggle */}
                                                    <div className="flex bg-stone-400/30 rounded-full p-0.5">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateMember.mutate({
                                                                    memberId: member.id,
                                                                    role: "viewer",
                                                                })
                                                            }
                                                            className={`px-2 py-0.5 text-[10px] font-semibold rounded-full transition-all ${
                                                                member.role === "viewer"
                                                                    ? "bg-stone-700 text-white"
                                                                    : "text-stone-600 hover:text-stone-800"
                                                            }`}
                                                            title="View only"
                                                        >
                                                            <Eye className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateMember.mutate({
                                                                    memberId: member.id,
                                                                    role: "editor",
                                                                })
                                                            }
                                                            className={`px-2 py-0.5 text-[10px] font-semibold rounded-full transition-all ${
                                                                member.role === "editor"
                                                                    ? "bg-stone-700 text-white"
                                                                    : "text-stone-600 hover:text-stone-800"
                                                            }`}
                                                            title="Can edit"
                                                        >
                                                            <Pencil className="w-3 h-3" />
                                                        </button>
                                                    </div>

                                                    {/* Hide events toggle */}
                                                    <button
                                                        type="button"
                                                        title={member.hideEvents ? "Events hidden from this user" : "Events visible to this user"}
                                                        onClick={() =>
                                                            updateMember.mutate({
                                                                memberId: member.id,
                                                                hideEvents: !member.hideEvents,
                                                            })
                                                        }
                                                        className={`p-1 rounded transition-colors ${
                                                            member.hideEvents
                                                                ? "text-stone-700 bg-stone-300/60"
                                                                : "text-stone-400 hover:text-stone-600"
                                                        }`}
                                                    >
                                                        <EyeOff className="w-3 h-3" />
                                                    </button>

                                                    {/* Remove */}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMember.mutate(member.userId)}
                                                        title="Remove member"
                                                        className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-100/60 transition-colors"
                                                    >
                                                        <UserMinus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <FindATimeDialog open={findATimeOpen} onOpenChange={setFindATimeOpen} />
        </>
    );
}
