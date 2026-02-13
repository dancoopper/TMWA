alter table "public"."templates"
add column if not exists "name" text not null default 'Untitled template',
add column if not exists "is_hidden" boolean not null default false;
