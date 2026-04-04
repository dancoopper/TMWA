import { avatarColorForUserId, avatarLetter } from "@/lib/memberAvatar";
import { cn } from "@/lib/utils";

type MemberDiscProps = {
    userId: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    /** When set (e.g. presence display name), its first character is shown. */
    label?: string | null;
    className?: string;
    title?: string;
};

export function MemberDisc({ userId, firstName, lastName, email, label, className, title }: MemberDiscProps) {
    const bg = avatarColorForUserId(userId);
    const letter = label?.trim()?.[0]
        ? label.trim()[0]!.toUpperCase()
        : avatarLetter(firstName, lastName, email);

    return (
        <span
            title={title}
            className={cn(
                "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                "text-[9px] font-semibold text-white shadow-sm ring-1 ring-black/10",
                className,
            )}
            style={{ backgroundColor: bg }}
        >
            {letter}
        </span>
    );
}
