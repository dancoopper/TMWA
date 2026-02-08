alter table "public"."workspaces" add column "updated_at" timestamp with time zone default now();

drop trigger if exists "protect_buckets_delete" on "storage"."buckets";

drop trigger if exists "protect_objects_delete" on "storage"."objects";


