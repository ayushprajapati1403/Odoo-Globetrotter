-- Setup script for the new roles-based system
-- Run this in your Supabase SQL editor

-- First, create the roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.roles (
  id serial NOT NULL,
  name text NOT NULL,
  description text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT roles_pkey PRIMARY KEY (id),
  CONSTRAINT roles_name_key UNIQUE (name)
);

-- Insert the default roles
INSERT INTO public.roles (id, name, description) VALUES
  (1, 'owner', 'Trip owner with full control including deletion'),
  (2, 'editor', 'Can edit trip details and manage content'),
  (3, 'viewer', 'Can view trip details but cannot make changes')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = now();

-- Update the sequence to start from the next available ID
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM public.roles));

-- Now you need to update existing user_trips records to use role IDs instead of text
-- This assumes you have existing data with text roles

-- First, let's see what the current data looks like (run this to check)
-- SELECT DISTINCT role FROM public.user_trips;

-- If you have existing data with text roles, you'll need to migrate it:
-- UPDATE public.user_trips SET role = 1 WHERE role = 'owner';
-- UPDATE public.user_trips SET role = 2 WHERE role = 'editor';
-- UPDATE public.user_trips SET role = 3 WHERE role = 'viewer';

-- After migration, you can alter the column type if needed:
-- ALTER TABLE public.user_trips ALTER COLUMN role TYPE integer USING role::integer;

-- Verify the setup
SELECT * FROM public.roles ORDER BY id;
SELECT 
  ut.trip_id,
  ut.user_id,
  r.name as role_name,
  ut.created_at
FROM public.user_trips ut
JOIN public.roles r ON ut.role = r.id
LIMIT 10;
