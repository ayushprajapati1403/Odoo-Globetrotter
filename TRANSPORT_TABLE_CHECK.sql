-- Check and fix trip_transport_details table setup
-- Run this in your Supabase SQL editor

-- 1. Check if table exists and has correct structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'trip_transport_details'
ORDER BY ordinal_position;

-- 2. Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'trip_transport_details';

-- 3. Check existing RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'trip_transport_details';

-- 4. Check if currencies table has data
SELECT COUNT(*) as currency_count FROM public.currencies;

-- 5. If no currencies exist, add some default ones
INSERT INTO public.currencies (code, name, symbol, exchange_rate_to_usd) 
SELECT 'USD', 'US Dollar', '$', 1.0
WHERE NOT EXISTS (SELECT 1 FROM public.currencies WHERE code = 'USD');

INSERT INTO public.currencies (code, name, symbol, exchange_rate_to_usd) 
SELECT 'EUR', 'Euro', '€', 0.85
WHERE NOT EXISTS (SELECT 1 FROM public.currencies WHERE code = 'EUR');

INSERT INTO public.currencies (code, name, symbol, exchange_rate_to_usd) 
SELECT 'GBP', 'British Pound', '£', 0.73
WHERE NOT EXISTS (SELECT 1 FROM public.currencies WHERE code = 'GBP');

-- 6. Check if transport_modes table has data
SELECT COUNT(*) as transport_modes_count FROM public.transport_modes;

-- 7. If no transport modes exist, add some default ones
INSERT INTO public.transport_modes (name, icon, description) 
SELECT 'Plane', '✈️', 'Air travel between cities'
WHERE NOT EXISTS (SELECT 1 FROM public.transport_modes WHERE name = 'Plane');

INSERT INTO public.transport_modes (name, icon, description) 
SELECT 'Train', '🚂', 'Rail travel between cities'
WHERE NOT EXISTS (SELECT 1 FROM public.transport_modes WHERE name = 'Train');

INSERT INTO public.transport_modes (name, icon, description) 
SELECT 'Bus', '🚌', 'Bus travel between cities'
WHERE NOT EXISTS (SELECT 1 FROM public.transport_modes WHERE name = 'Bus');

INSERT INTO public.transport_modes (name, icon, description) 
SELECT 'Car', '🚗', 'Car travel between cities'
WHERE NOT EXISTS (SELECT 1 FROM public.transport_modes WHERE name = 'Car');

-- 8. Verify the table permissions
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'trip_transport_details';

-- 9. Test insert (this should work if everything is set up correctly)
-- Note: Replace the UUIDs with actual values from your database
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
    'Plane',
    'Test Provider',
    '2024-01-15T10:00:00Z',
    '2024-01-15T12:00:00Z',
    150.00,
    (SELECT id FROM public.currencies WHERE code = 'USD' LIMIT 1),
    'TEST123',
    'Test transport detail'
);
*/
