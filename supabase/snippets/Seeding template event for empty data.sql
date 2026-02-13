insert into public.templates (id, user_id, data)
values
(1, 'c9fd4d15-2ec1-4da3-9203-0f43f0d1bc52', '[]'::jsonb);


INSERT INTO "public"."events" 
("id", "template_id", "workspace_id", "date", "title", "data") 
VALUES 
('1', '1', '1', '2026-02-10 09:00:00+00', 'Mobile Dev', '[]'), 
('2', '1', '1', '2026-02-13 21:34:12+00', 'Capstone', '[]'), 
('3', '1', '1', '2026-02-12 22:03:21+00', 'Task1', '[]');