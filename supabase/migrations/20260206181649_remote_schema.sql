alter table "public"."user_profiles" drop column "company";

alter table "public"."user_profiles" drop column "dob";

alter table "public"."user_profiles" drop column "full_name";

alter table "public"."user_profiles" drop column "onboarded";

alter table "public"."user_profiles" drop column "role";

alter table "public"."user_profiles" add column "first_name" text;

alter table "public"."user_profiles" add column "is_onboarded" boolean default false;

alter table "public"."user_profiles" add column "last_name" text;

alter table "public"."user_profiles" add column "timezone" text;


