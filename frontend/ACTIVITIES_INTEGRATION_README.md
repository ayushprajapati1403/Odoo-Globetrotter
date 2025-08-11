# Activities Integration with Supabase

This document explains how the new activities system works in the ItineraryBuilder component.

## Overview

The activities system has been updated to integrate with Supabase, allowing users to select from predefined activities in the database instead of creating custom ones. This provides better cost optimization and standardization.

## Key Changes

### 1. Activity Selection
- Users can no longer create custom activities with arbitrary names and costs
- Activities are now selected from a dropdown populated from the `activities` table
- Each activity has predefined costs, durations, and metadata from the database

### 2. Cost Management
- Activity costs are automatically pulled from the database
- Users cannot modify activity costs, ensuring accurate cost tracking
- This enables better budget optimization and cost analysis

### 3. Database Integration
- Activities are fetched from the `activities` table based on the selected city
- The `trip_activities` table now properly references the `activities` table
- Activity names and costs are automatically populated when creating trip activities

## Database Schema

### Activities Table
```sql
CREATE TABLE public.activities (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  city_id uuid REFERENCES public.cities(id),
  name text NOT NULL,
  description text,
  category text,
  cost numeric,
  duration_minutes integer,
  currency_id uuid REFERENCES public.currencies(id),
  start_time time without time zone,
  end_time time without time zone,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  deleted boolean DEFAULT false
);
```

### Trip Activities Table
```sql
CREATE TABLE public.trip_activities (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  trip_stop_id uuid REFERENCES public.trip_stops(id),
  activity_id uuid REFERENCES public.activities(id),
  name text NOT NULL, -- Auto-populated from activities table
  cost numeric, -- Auto-populated from activities table
  scheduled_date timestamp with time zone,
  start_time time without time zone,
  duration_minutes integer,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

## Setup Instructions

### 1. Populate Activities Table
Use the provided `ACTIVITIES_SAMPLE_DATA.sql` script to populate your activities table:

1. First, ensure you have cities in your `cities` table
2. Update the city IDs in the SQL script to match your actual city IDs
3. Update the currency ID to match your USD currency record
4. Run the script in your Supabase SQL editor

### 2. Find Your City IDs
```sql
SELECT id, name, country FROM cities WHERE name IN ('Paris', 'New York', 'London', 'Tokyo', 'Rome');
```

### 3. Find Your USD Currency ID
```sql
SELECT id, code, name FROM currencies WHERE code = 'USD';
```

## How It Works

### 1. Adding Activities to Trip Stops
1. User selects a city for their trip stop
2. When adding an activity, the system fetches all available activities for that city
3. User selects from the dropdown of available activities
4. System automatically populates the activity name and cost from the database
5. User can set the scheduled date, time, and duration
6. User can add personal notes

### 2. Cost Optimization Benefits
- **Standardized Pricing**: All users see the same activity costs
- **Budget Planning**: Accurate cost estimates for trip planning
- **Cost Analysis**: Easy to compare costs across different cities and activities
- **No Overcharging**: Users cannot inflate activity costs

### 3. User Experience
- **Simplified Selection**: No need to type activity names
- **Rich Information**: Activities include descriptions, categories, and metadata
- **Time Management**: Users can still customize when and how long to do activities
- **Personal Notes**: Users can add their own notes and preferences

## Frontend Components

### ItineraryBuilder.tsx
- **Activity Modal**: Now shows a dropdown instead of free-text input
- **Activity Display**: Shows actual activities with costs, times, and edit/delete options
- **City Integration**: Automatically fetches activities when a city is selected

### ItineraryService.ts
- **getCityActivities()**: Fetches activities for a specific city
- **addActivityToStop()**: Creates trip activities with auto-populated data
- **updateTripActivity()**: Updates activities while maintaining cost integrity

## Benefits of This Approach

### 1. Cost Accuracy
- Eliminates user input errors in pricing
- Provides consistent pricing across all users
- Enables better budget tracking and reporting

### 2. Data Quality
- Standardized activity names and descriptions
- Rich metadata for better recommendations
- Professional activity information

### 3. User Experience
- Faster activity selection
- No need to research activity costs
- Better trip planning with accurate estimates

### 4. Business Intelligence
- Track popular activities by city
- Analyze cost patterns across destinations
- Generate activity recommendations

## Future Enhancements

### 1. Activity Recommendations
- Suggest activities based on trip duration and budget
- Recommend activities based on user preferences
- Seasonal activity suggestions

### 2. Dynamic Pricing
- Real-time cost updates from providers
- Seasonal pricing variations
- Special offers and discounts

### 3. Activity Categories
- Filter activities by category (Museum, Landmark, Food, etc.)
- Category-based cost analysis
- Themed activity packages

### 4. User Reviews
- Allow users to rate activities
- Share activity experiences
- Build activity popularity scores

## Troubleshooting

### Common Issues

1. **No Activities Showing**: Ensure the activities table is populated and city IDs match
2. **Cost Not Displaying**: Check that the currency_id references are correct
3. **Activities Not Loading**: Verify the `getCityActivities` function is working

### Debug Queries

```sql
-- Check if activities exist for a city
SELECT * FROM activities WHERE city_id = 'your-city-id';

-- Check trip activities
SELECT ta.*, a.name as activity_name, a.cost as activity_cost 
FROM trip_activities ta 
JOIN activities a ON ta.activity_id = a.id 
WHERE ta.trip_stop_id = 'your-stop-id';
```

## Conclusion

This new activities system provides a more professional, accurate, and user-friendly way to plan trips. By integrating with Supabase and using predefined activities, users get better cost estimates and a more streamlined planning experience, while the system maintains data integrity and enables better cost optimization.
