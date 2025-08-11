-- Database setup for TravelPro application
-- Run this in your Supabase SQL editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the trips table
CREATE TABLE IF NOT EXISTS public.trips (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NULL,
  name text NOT NULL,
  description text NULL,
  start_date date NULL,
  end_date date NULL,
  is_public boolean NULL DEFAULT false,
  cover_photo_url text NULL,
  currency text NULL DEFAULT 'USD'::text,
  total_estimated_cost numeric(12, 2) NULL,
  metadata jsonb NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  deleted boolean NULL DEFAULT false,
  CONSTRAINT trips_pkey PRIMARY KEY (id),
  CONSTRAINT trips_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Create the user_trips table
CREATE TABLE IF NOT EXISTS public.user_trips (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL,
  invited_by uuid NULL,
  last_modified_by uuid NULL,
  last_modified_at timestamp with time zone NULL DEFAULT now(),
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT user_trips_pkey PRIMARY KEY (id),
  CONSTRAINT user_trips_trip_id_user_id_key UNIQUE (trip_id, user_id),
  CONSTRAINT user_trips_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT user_trips_last_modified_by_fkey FOREIGN KEY (last_modified_by) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT user_trips_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT user_trips_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE,
  CONSTRAINT user_trips_role_check CHECK (
    (
      role = any (
        array['owner'::text, 'editor'::text, 'viewer'::text]
      )
    )
  )
) TABLESPACE pg_default;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trips_user ON public.trips USING btree (user_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_trips_dates ON public.trips USING btree (start_date, end_date) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_user_trips_trip_user ON public.user_trips USING btree (trip_id, user_id) TABLESPACE pg_default;

-- Create timestamp trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for trips table
DROP TRIGGER IF EXISTS trg_trips_timestamps ON public.trips;
CREATE TRIGGER trg_trips_timestamps 
  BEFORE UPDATE ON trips 
  FOR EACH ROW 
  EXECUTE FUNCTION trigger_set_timestamp();

-- Create trigger for user_trips table
DROP TRIGGER IF EXISTS trg_user_trips_timestamps ON public.user_trips;
CREATE TRIGGER trg_user_trips_timestamps 
  BEFORE UPDATE ON user_trips 
  FOR EACH ROW 
  EXECUTE FUNCTION trigger_set_timestamp();

-- Enable Row Level Security (RLS)
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_trips ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trips table
-- Users can view trips they own or have access to through user_trips
CREATE POLICY "Users can view trips they have access to" ON public.trips
  FOR SELECT USING (
    user_id = auth.uid() OR
    id IN (
      SELECT trip_id FROM public.user_trips WHERE user_id = auth.uid()
    )
  );

-- Users can insert trips (they become the owner)
CREATE POLICY "Users can create trips" ON public.trips
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update trips they own
CREATE POLICY "Users can update trips they own" ON public.trips
  FOR UPDATE USING (user_id = auth.uid());

-- Users can delete trips they own (soft delete)
CREATE POLICY "Users can delete trips they own" ON public.trips
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for user_trips table
-- Users can view user_trips entries they're part of
CREATE POLICY "Users can view their user_trips" ON public.user_trips
  FOR SELECT USING (user_id = auth.uid());

-- Users can insert user_trips entries
CREATE POLICY "Users can create user_trips" ON public.user_trips
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Trip owners can update user_trips for their trips
CREATE POLICY "Trip owners can update user_trips" ON public.user_trips
  FOR UPDATE USING (
    trip_id IN (
      SELECT id FROM public.trips WHERE user_id = auth.uid()
    )
  );

-- Trip owners can delete user_trips for their trips
CREATE POLICY "Trip owners can delete user_trips" ON public.user_trips
  FOR DELETE USING (
    trip_id IN (
      SELECT id FROM public.trips WHERE user_id = auth.uid()
    )
  );

-- Grant necessary permissions
GRANT ALL ON public.trips TO authenticated;
GRANT ALL ON public.user_trips TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
