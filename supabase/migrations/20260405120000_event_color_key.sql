-- Event color for calendar UI (fixed palette keys, not free-form hex).
alter table public.events
    add column if not exists color_key text not null default 'sage';

alter table public.events
    drop constraint if exists events_color_key_check;

alter table public.events
    add constraint events_color_key_check check (
        color_key in (
            'sage',
            'sky',
            'lavender',
            'coral',
            'amber',
            'rose',
            'slate',
            'mist'
        )
    );
