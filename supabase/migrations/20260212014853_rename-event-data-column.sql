alter table "public"."events" drop column "event_data";

alter table "public"."events" add column "data" jsonb not null;


