const PALETTE = [
    "#b87a7a",
    "#7a8fb8",
    "#7ab88a",
    "#b8a67a",
    "#9a7ab8",
    "#7ab8b0",
    "#b88a9e",
    "#8a9e7a",
];

export function avatarColorForUserId(userId: string): string {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return PALETTE[Math.abs(hash) % PALETTE.length] ?? PALETTE[0];
}

/** Single letter for small avatar discs. */
export function avatarLetter(
    firstName: string | null | undefined,
    lastName: string | null | undefined,
    emailFallback?: string | null,
): string {
    const f = firstName?.trim()?.[0];
    if (f) return f.toUpperCase();
    const l = lastName?.trim()?.[0];
    if (l) return l.toUpperCase();
    const e = emailFallback?.trim()?.[0];
    if (e) return e.toUpperCase();
    return "?";
}

export function displayInitial(
    firstName: string | null | undefined,
    lastName: string | null | undefined,
    emailFallback?: string | null,
): string {
    const f = firstName?.trim()?.[0];
    const l = lastName?.trim()?.[0];
    if (f && l) return `${f}${l}`.toUpperCase();
    if (f) return f.toUpperCase();
    if (l) return l.toUpperCase();
    const e = emailFallback?.trim()?.[0];
    if (e) return e.toUpperCase();
    return "?";
}
