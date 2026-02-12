insert into public.templates (id, user_id, data)
values
(1, 'c9fd4d15-2ec1-4da3-9203-0f43f0d1bc52', '[]'::jsonb);

insert into public.events (template_id, workspace_id, date, title, data)
values 
(1, 1, '2026-02-10T09:00:00Z'::timestamptz, 'Capstone', '[]'::jsonb);