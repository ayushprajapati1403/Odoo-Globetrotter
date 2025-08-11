-- Create trip_accommodations table to link trips with accommodations
CREATE TABLE IF NOT EXISTS public.trip_accommodations (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  trip_id uuid NOT NULL,
  accommodation_id uuid NOT NULL,
  check_in_date date NOT NULL,
  check_out_date date NOT NULL,
  notes text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT trip_accommodations_pkey PRIMARY KEY (id),
  CONSTRAINT trip_accommodations_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  CONSTRAINT trip_accommodations_accommodation_id_fkey FOREIGN KEY (accommodation_id) REFERENCES accommodations(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trip_accommodations_trip_id ON public.trip_accommodations USING btree (trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_accommodations_accommodation_id ON public.trip_accommodations USING btree (accommodation_id);
CREATE INDEX IF NOT EXISTS idx_trip_accommodations_dates ON public.trip_accommodations USING btree (check_in_date, check_out_date);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_trip_accommodations_timestamps
  BEFORE UPDATE ON trip_accommodations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- Grant permissions
GRANT ALL ON public.trip_accommodations TO authenticated;
GRANT ALL ON public.trip_accommodations TO service_role;

-- Enable Row Level Security
ALTER TABLE public.trip_accommodations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own trip accommodations" ON public.trip_accommodations
  FOR SELECT USING (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own trip accommodations" ON public.trip_accommodations
  FOR INSERT WITH CHECK (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own trip accommodations" ON public.trip_accommodations
  FOR UPDATE USING (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own trip accommodations" ON public.trip_accommodations
  FOR DELETE USING (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid()
    )
  );

-- Insert some sample accommodations for testing (optional)
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
  ('sample-city-id-1', 'Marriott', 'Marriott Downtown', 150.00, 'USD', NULL),
  ('sample-city-id-1', 'Hilton', 'Hilton Garden Inn', 120.00, 'USD', NULL),
  ('sample-city-id-2', 'Airbnb', 'Cozy Downtown Apartment', 80.00, 'USD', NULL),
  ('sample-city-id-2', 'Best Western', 'Best Western Plus', 95.00, 'USD', NULL)
ON CONFLICT DO NOTHING;
