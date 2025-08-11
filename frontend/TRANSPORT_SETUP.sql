-- Transport Setup Script for Trip Planning Application
-- This script creates the necessary tables and functions for managing transport details
-- Uses existing transport_costs table for reference data

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create trip_transport_details table for user's actual transport bookings
CREATE TABLE IF NOT EXISTS public.trip_transport_details (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL,
  from_city_id uuid NOT NULL,
  to_city_id uuid NOT NULL,
  transport_mode text NOT NULL,
  provider text NOT NULL,
  departure_time time without time zone NOT NULL,
  arrival_time time without time zone NOT NULL,
  cost numeric NOT NULL,
  currency_id uuid NOT NULL,
  booking_reference text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT trip_transport_details_pkey PRIMARY KEY (id),
  CONSTRAINT trip_transport_details_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE CASCADE,
  CONSTRAINT trip_transport_details_from_city_id_fkey FOREIGN KEY (from_city_id) REFERENCES public.cities(id),
  CONSTRAINT trip_transport_details_to_city_id_fkey FOREIGN KEY (to_city_id) REFERENCES public.cities(id),
  CONSTRAINT trip_transport_details_currency_id_fkey FOREIGN KEY (currency_id) REFERENCES public.currencies(id),
  CONSTRAINT trip_transport_details_different_cities CHECK (from_city_id != to_city_id),
  CONSTRAINT trip_transport_details_valid_times CHECK (arrival_time > departure_time)
);

-- Note: The transport_costs table already exists and contains reference data for transport costs between cities
-- This table is used to provide cost suggestions to users when they add transport details

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trip_transport_details_trip_id ON public.trip_transport_details(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_transport_details_from_city ON public.trip_transport_details(from_city_id);
CREATE INDEX IF NOT EXISTS idx_trip_transport_details_to_city ON public.trip_transport_details(to_city_id);
CREATE INDEX IF NOT EXISTS idx_trip_transport_details_mode ON public.trip_transport_details(transport_mode);
CREATE INDEX IF NOT EXISTS idx_trip_transport_details_departure_time ON public.trip_transport_details(departure_time);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_trip_transport_details_updated_at ON public.trip_transport_details;
CREATE TRIGGER update_trip_transport_details_updated_at
    BEFORE UPDATE ON public.trip_transport_details
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample transport modes into a new table (optional)
CREATE TABLE IF NOT EXISTS public.transport_modes (
  id text PRIMARY KEY,
  name text NOT NULL,
  icon text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now()
);

-- Insert default transport modes
INSERT INTO public.transport_modes (id, name, icon, description) VALUES
  ('plane', 'Plane', '✈️', 'Air travel between cities'),
  ('train', 'Train', '🚂', 'Rail travel between cities'),
  ('bus', 'Bus', '🚌', 'Bus travel between cities'),
  ('car', 'Car', '🚗', 'Car rental or driving'),
  ('ferry', 'Ferry', '⛴️', 'Water transport'),
  ('walking', 'Walking', '🚶', 'Walking between nearby locations'),
  ('bicycle', 'Bicycle', '🚲', 'Bicycle rental or cycling'),
  ('other', 'Other', '🚀', 'Other transport methods')
ON CONFLICT (id) DO NOTHING;

-- Create view for transport details with city names
CREATE OR REPLACE VIEW public.transport_details_view AS
SELECT 
  ttd.id,
  ttd.trip_id,
  ttd.from_city_id,
  fc.name as from_city_name,
  fc.country as from_city_country,
  ttd.to_city_id,
  tc.name as to_city_name,
  tc.country as to_city_country,
  ttd.transport_mode,
  tm.name as transport_mode_name,
  tm.icon as transport_mode_icon,
  ttd.provider,
  ttd.departure_time,
  ttd.arrival_time,
  ttd.cost,
  ttd.currency_id,
  c.code as currency_code,
  c.symbol as currency_symbol,
  ttd.booking_reference,
  ttd.notes,
  ttd.created_at,
  ttd.updated_at
FROM public.trip_transport_details ttd
JOIN public.cities fc ON ttd.from_city_id = fc.id
JOIN public.cities tc ON ttd.to_city_id = tc.id
JOIN public.transport_modes tm ON ttd.transport_mode = tm.id
JOIN public.currencies c ON ttd.currency_id = c.id;

-- Create function to calculate total transport cost for a trip
CREATE OR REPLACE FUNCTION calculate_trip_transport_cost(trip_uuid uuid, target_currency_code text DEFAULT 'USD')
RETURNS numeric AS $$
DECLARE
  total_cost numeric := 0;
  currency_rate numeric;
  transport_record record;
BEGIN
  FOR transport_record IN 
    SELECT ttd.cost, c.exchange_rate_to_usd
    FROM public.trip_transport_details ttd
    JOIN public.currencies c ON ttd.currency_id = c.id
    WHERE ttd.trip_id = trip_uuid
  LOOP
    -- Convert to target currency (simplified - assumes USD as base)
    currency_rate := COALESCE(transport_record.exchange_rate_to_usd, 1);
    total_cost := total_cost + (transport_record.cost * currency_rate);
  END LOOP;
  
  RETURN total_cost;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trip_transport_details TO authenticated;
GRANT SELECT ON public.transport_modes TO authenticated;
GRANT SELECT ON public.transport_details_view TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_trip_transport_cost(uuid, text) TO authenticated;

-- Create RLS policies for trip_transport_details
ALTER TABLE public.trip_transport_details ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see transport details for trips they have access to
CREATE POLICY "Users can view transport details for accessible trips" ON public.trip_transport_details
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_trips ut
      WHERE ut.trip_id = trip_transport_details.trip_id
      AND ut.user_id = auth.uid()
    )
  );

-- Policy: Users can insert transport details for trips they can edit
CREATE POLICY "Users can insert transport details for editable trips" ON public.trip_transport_details
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_trips ut
      WHERE ut.trip_id = trip_transport_details.trip_id
      AND ut.user_id = auth.uid()
      AND (ut.role = 1 OR ut.role = 2) -- Admin or Editor role
    )
  );

-- Policy: Users can update transport details for trips they can edit
CREATE POLICY "Users can update transport details for editable trips" ON public.trip_transport_details
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_trips ut
      WHERE ut.trip_id = trip_transport_details.trip_id
      AND ut.user_id = auth.uid()
      AND (ut.role = 1 OR ut.role = 2) -- Admin or Editor role
    )
  );

-- Policy: Users can delete transport details for trips they can edit
CREATE POLICY "Users can delete transport details for editable trips" ON public.trip_transport_details
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_trips ut
      WHERE ut.trip_id = trip_transport_details.trip_id
      AND ut.user_id = auth.uid()
      AND (ut.role = 1 OR ut.role = 2) -- Admin or Editor role
    )
  );

-- Insert sample data for testing (optional)
-- Uncomment the following lines if you want to add sample transport data

/*
INSERT INTO public.trip_transport_details (
  trip_id,
  from_city_id,
  to_city_id,
  transport_mode,
  provider,
  departure_time,
  arrival_time,
  cost,
  currency_id,
  booking_reference,
  notes
) VALUES (
  'your-trip-uuid-here',
  'your-from-city-uuid-here',
  'your-to-city-uuid-here',
  'plane',
  'Delta Airlines',
  '10:00:00',
  '12:30:00',
  299.99,
  'your-usd-currency-uuid-here',
  'DL1234',
  'Direct flight, economy class'
);
*/

-- Display setup completion message
DO $$
BEGIN
  RAISE NOTICE 'Transport setup completed successfully!';
  RAISE NOTICE 'Created table: trip_transport_details';
  RAISE NOTICE 'Created table: transport_modes';
  RAISE NOTICE 'Created view: transport_details_view';
  RAISE NOTICE 'Created function: calculate_trip_transport_cost';
  RAISE NOTICE 'Applied RLS policies for security';
END $$;
