-- Event time range: `date` remains start time; `ends_at` is exclusive end (or end instant).
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS ends_at timestamp with time zone;

UPDATE public.events
SET ends_at = "date" + interval '1 hour'
WHERE ends_at IS NULL;

ALTER TABLE public.events
  ALTER COLUMN ends_at SET NOT NULL;
