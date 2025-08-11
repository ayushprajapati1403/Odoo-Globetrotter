# Itinerary System Setup Guide

## Overview

This guide explains how to set up and use the new itinerary system that integrates with your Supabase database. The system includes trip building, viewing, and admin trip suggestions.

## Database Schema

### **Core Tables:**

#### **trips** - Main trip information
```sql
CREATE TABLE public.trips (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  description text,
  start_date date,
  end_date date,
  is_public boolean DEFAULT true,
  cover_photo_url text,
  currency text DEFAULT 'USD',
  total_estimated_cost numeric,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  deleted boolean DEFAULT false,
  trip_type text DEFAULT 'custom' CHECK (trip_type IN ('admin_defined', 'custom')),
  created_by uuid REFERENCES auth.users(id),
  CONSTRAINT trips_pkey PRIMARY KEY (id)
);
```

#### **trip_stops** - Cities visited on the trip
```sql
CREATE TABLE public.trip_stops (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  seq integer NOT NULL,
  city_id uuid REFERENCES cities(id),
  start_date date,
  end_date date,
  local_transport_cost numeric,
  accommodation_estimate numeric,
  notes text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT trip_stops_pkey PRIMARY KEY (id)
);
```

#### **trip_activities** - Activities at each stop
```sql
CREATE TABLE public.trip_activities (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  trip_stop_id uuid REFERENCES trip_stops(id) ON DELETE CASCADE,
  activity_id uuid REFERENCES activities(id),
  name text NOT NULL,
  scheduled_date timestamp with time zone,
  start_time time without time zone,
  duration_minutes integer,
  cost numeric,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT trip_activities_pkey PRIMARY KEY (id)
);
```

#### **cities** - Available cities
```sql
CREATE TABLE public.cities (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  country text,
  iso_country_code text,
  lat numeric,
  lng numeric,
  population bigint,
  cost_index numeric DEFAULT 1.0,
  avg_daily_hotel numeric,
  popularity_score numeric DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  currency_id uuid REFERENCES currencies(id),
  CONSTRAINT cities_pkey PRIMARY KEY (id)
);
```

#### **activities** - Available activities in cities
```sql
CREATE TABLE public.activities (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  city_id uuid REFERENCES cities(id),
  name text NOT NULL,
  description text,
  category text,
  cost numeric,
  duration_minutes integer,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  deleted boolean DEFAULT false,
  currency_id uuid REFERENCES currencies(id),
  start_time time without time zone,
  end_time time without time zone,
  CONSTRAINT activities_pkey PRIMARY KEY (id)
);
```

## Setup Instructions

### **1. Database Setup**

Run these SQL commands in your Supabase SQL editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables (if they don't exist)
-- The tables should already exist based on your schema

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_trip_stops_trip_id ON trip_stops(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_seq ON trip_stops(seq);
CREATE INDEX IF NOT EXISTS idx_trip_activities_stop_id ON trip_activities(trip_stop_id);
CREATE INDEX IF NOT EXISTS idx_cities_popularity ON cities(popularity_score DESC);
CREATE INDEX IF NOT EXISTS idx_activities_city_id ON activities(city_id);

-- Enable Row Level Security
ALTER TABLE trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
```

### **2. RLS Policies**

#### **Trip Stops Policy:**
```sql
-- Users can view stops for trips they own or public trips
CREATE POLICY "Users can view own trip stops" ON trip_stops
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = trip_stops.trip_id 
      AND (trips.user_id = auth.uid() OR trips.is_public = true)
    )
  );

-- Users can edit stops for trips they own
CREATE POLICY "Users can edit own trip stops" ON trip_stops
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = trip_stops.trip_id 
      AND trips.user_id = auth.uid()
    )
  );
```

#### **Trip Activities Policy:**
```sql
-- Users can view activities for trips they own or public trips
CREATE POLICY "Users can view own trip activities" ON trip_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM trip_stops ts
      JOIN trips t ON t.id = ts.trip_id
      WHERE ts.id = trip_activities.trip_stop_id 
      AND (t.user_id = auth.uid() OR t.is_public = true)
    )
  );

-- Users can edit activities for trips they own
CREATE POLICY "Users can edit own trip activities" ON trip_activities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM trip_stops ts
      JOIN trips t ON t.id = ts.trip_id
      WHERE ts.id = trip_activities.trip_stop_id 
      AND t.user_id = auth.uid()
    )
  );
```

#### **Cities Policy:**
```sql
-- Anyone can view cities
CREATE POLICY "Anyone can view cities" ON cities
  FOR SELECT USING (true);
```

#### **Activities Policy:**
```sql
-- Anyone can view non-deleted activities
CREATE POLICY "Anyone can view activities" ON activities
  FOR SELECT USING (deleted = false);
```

### **3. Sample Data**

#### **Insert Sample Cities:**
```sql
INSERT INTO cities (name, country, iso_country_code, lat, lng, popularity_score) VALUES
('Paris', 'France', 'FR', 48.8566, 2.3522, 95),
('Rome', 'Italy', 'IT', 41.9028, 12.4964, 90),
('Barcelona', 'Spain', 'ES', 41.3851, 2.1734, 85),
('Amsterdam', 'Netherlands', 'NL', 52.3676, 4.9041, 80),
('Prague', 'Czech Republic', 'CZ', 50.0755, 14.4378, 75),
('Vienna', 'Austria', 'AT', 48.2082, 16.3738, 70),
('Budapest', 'Hungary', 'HU', 47.4979, 19.0402, 65),
('Krakow', 'Poland', 'PL', 50.0647, 19.9450, 60);
```

#### **Insert Sample Activities:**
```sql
INSERT INTO activities (city_id, name, description, category, cost, duration_minutes) VALUES
((SELECT id FROM cities WHERE name = 'Paris'), 'Visit the Louvre', 'World''s largest art museum', 'Culture', 17, 180),
((SELECT id FROM cities WHERE name = 'Paris'), 'Eiffel Tower', 'Iconic iron lattice tower', 'Landmark', 25, 120),
((SELECT id FROM cities WHERE name = 'Rome'), 'Colosseum Tour', 'Ancient amphitheater', 'History', 20, 150),
((SELECT id FROM cities WHERE name = 'Rome'), 'Vatican Museums', 'Art and history collections', 'Culture', 22, 200),
((SELECT id FROM cities WHERE name = 'Barcelona'), 'Sagrada Familia', 'Famous church by Gaudi', 'Architecture', 30, 120),
((SELECT id FROM cities WHERE name = 'Barcelona'), 'Park Güell', 'Colorful park with mosaics', 'Nature', 10, 90);
```

#### **Create Admin Trip Template:**
```sql
-- First, create a trip with trip_type = 'admin_defined'
INSERT INTO trips (user_id, name, description, start_date, end_date, trip_type, is_public) VALUES
('your-admin-user-id', 'Classic Europe Tour', 'A perfect introduction to European culture and history', '2025-06-01', '2025-06-15', 'admin_defined', true);

-- Then add trip stops
INSERT INTO trip_stops (trip_id, seq, city_id, start_date, end_date, notes) VALUES
((SELECT id FROM trips WHERE name = 'Classic Europe Tour'), 1, (SELECT id FROM cities WHERE name = 'Paris'), '2025-06-01', '2025-06-05', 'Start your journey in the City of Light'),
((SELECT id FROM trips WHERE name = 'Classic Europe Tour'), 2, (SELECT id FROM cities WHERE name = 'Rome'), '2025-06-05', '2025-06-10', 'Experience ancient history and culture'),
((SELECT id FROM trips WHERE name = 'Classic Europe Tour'), 3, (SELECT id FROM cities WHERE name = 'Barcelona'), '2025-06-10', '2025-06-15', 'End with Mediterranean charm and architecture');
```

## Component Features

### **1. ItineraryBuilder**
- ✅ **Add/Edit Cities**: Add cities to your trip with dates and notes
- ✅ **City Search**: Search and select from available cities
- ✅ **Sequencing**: Automatic ordering of cities
- ✅ **Cost Tracking**: Track transport and accommodation costs
- ✅ **Activity Management**: Add activities to each city stop
- ✅ **Permission Control**: Only trip owners can edit

### **2. ItineraryView**
- ✅ **List View**: See all cities in chronological order
- ✅ **Calendar View**: Calendar-based view (coming soon)
- ✅ **Cost Summary**: View total costs for the trip
- ✅ **Trip Statistics**: Overview of cities, days, and activities
- ✅ **Export Options**: Print, share, and export functionality

### **3. TripSuggestions**
- ✅ **Admin Templates**: Curated trip templates by travel experts
- ✅ **One-Click Cloning**: Clone admin trips with customizations
- ✅ **Personalization**: Modify dates, names, and descriptions
- ✅ **Instant Access**: Start planning with proven itineraries

## Usage Workflow

### **Creating a New Trip:**
1. Go to `/my-trips`
2. Click "Create New Trip"
3. Fill in basic trip details
4. Save and continue to itinerary builder

### **Building Your Itinerary:**
1. In the itinerary builder, click "Add City"
2. Search for and select a city
3. Set arrival and departure dates
4. Add notes and cost estimates
5. Add activities to each city
6. Save your progress

### **Using Trip Suggestions:**
1. Scroll down to "Trip Suggestions" on `/my-trips`
2. Browse admin-created templates
3. Click "Clone Trip" on a template you like
4. Customize the trip details
5. Your new trip is ready to edit!

### **Viewing Your Itinerary:**
1. Click "View Trip" on any trip card
2. See your itinerary in list or calendar view
3. Use the edit button to make changes
4. Share or export your itinerary

## Admin Trip Management

### **Creating Admin Trip Templates:**
1. **Set trip_type to 'admin_defined'** when creating trips
2. **Make trips public** so users can see them
3. **Use your admin user ID** as the user_id
4. **Add comprehensive stops and activities** for a complete template

### **Best Practices:**
- Create templates for popular destinations
- Include realistic dates and costs
- Add detailed notes and descriptions
- Use high-quality cover photos
- Test the template by cloning it yourself

## Troubleshooting

### **Common Issues:**

#### **"Access Denied" errors:**
- Check if RLS policies are properly set
- Verify user authentication status
- Ensure trip ownership or public access

#### **Cities not showing in search:**
- Verify cities table has data
- Check if city names match search queries
- Ensure proper indexing on name and country fields

#### **Activities not displaying:**
- Check if activities are marked as deleted = false
- Verify city_id relationships
- Ensure proper RLS policies

#### **Trip suggestions not loading:**
- Verify admin trips have trip_type = 'admin_defined'
- Check if trips are marked as public
- Ensure trips are not deleted

### **Debug Commands:**
```sql
-- Check trip ownership
SELECT t.name, t.user_id, t.trip_type, t.is_public 
FROM trips t 
WHERE t.deleted = false;

-- Verify trip stops
SELECT ts.*, c.name as city_name 
FROM trip_stops ts 
JOIN cities c ON ts.city_id = c.id 
WHERE ts.trip_id = 'your-trip-id';

-- Check admin trip suggestions
SELECT * FROM trips 
WHERE trip_type = 'admin_defined' 
AND is_public = true 
AND deleted = false;
```

## Performance Tips

### **Database Optimization:**
- Use indexes on frequently queried fields
- Implement pagination for large datasets
- Cache popular cities and activities
- Use database views for complex queries

### **Frontend Optimization:**
- Implement lazy loading for trip data
- Use React.memo for expensive components
- Debounce search inputs
- Cache API responses

## Next Steps

1. **Test the system** with sample data
2. **Create admin trip templates** for popular destinations
3. **Customize the UI** to match your brand
4. **Add more features** like:
   - Real-time collaboration
   - Advanced cost tracking
   - Photo galleries
   - Travel document storage
   - Weather integration
   - Local transportation options

This itinerary system provides a solid foundation for trip planning with room for future enhancements!
