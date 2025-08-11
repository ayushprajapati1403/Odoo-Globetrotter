-- Sample Activities Data for Major Cities
-- This script populates the activities table with sample data for testing

-- First, ensure we have some cities (adjust city IDs as needed)
-- You may need to run this after creating cities in your database

-- Paris Activities
INSERT INTO public.activities (city_id, name, description, category, cost, duration_minutes, currency_id, start_time, end_time, metadata) VALUES
('your-paris-city-id', 'Visit the Louvre Museum', 'Explore the world''s largest art museum with over 35,000 works of art', 'Museum', 17.00, 180, 'your-usd-currency-id', '09:00:00', '12:00:00', '{"popularity": 95, "best_time": "morning", "skip_line": true}'),
('your-paris-city-id', 'Eiffel Tower Tour', 'Climb or take the elevator to the top of the iconic Eiffel Tower', 'Landmark', 26.10, 120, 'your-usd-currency-id', '14:00:00', '16:00:00', '{"popularity": 98, "best_time": "afternoon", "reservation_required": true}'),
('your-paris-city-id', 'Seine River Cruise', 'Enjoy a scenic boat ride along the Seine River', 'Sightseeing', 15.00, 60, 'your-usd-currency-id', '16:00:00', '17:00:00', '{"popularity": 85, "best_time": "late_afternoon", "romantic": true}'),
('your-paris-city-id', 'Notre-Dame Cathedral', 'Visit the famous Gothic cathedral (exterior only due to restoration)', 'Religious', 0.00, 45, 'your-usd-currency-id', '10:00:00', '10:45:00', '{"popularity": 90, "best_time": "morning", "free": true}'),
('your-paris-city-id', 'Champs-Élysées Walk', 'Stroll down the famous avenue and visit luxury shops', 'Shopping', 0.00, 90, 'your-usd-currency-id', '15:00:00', '16:30:00', '{"popularity": 80, "best_time": "afternoon", "free": true}');

-- New York Activities
INSERT INTO public.activities (city_id, name, description, category, cost, duration_minutes, currency_id, start_time, end_time, metadata) VALUES
('your-nyc-city-id', 'Statue of Liberty & Ellis Island', 'Visit the iconic statue and immigration museum', 'Landmark', 24.50, 180, 'your-usd-currency-id', '09:00:00', '12:00:00', '{"popularity": 95, "best_time": "morning", "reservation_required": true}'),
('your-nyc-city-id', 'Central Park Walking Tour', 'Explore the famous urban park with a guided tour', 'Nature', 25.00, 120, 'your-usd-currency-id', '10:00:00', '12:00:00', '{"popularity": 88, "best_time": "morning", "outdoor": true}'),
('your-nyc-city-id', 'Times Square Visit', 'Experience the bright lights and energy of Times Square', 'Sightseeing', 0.00, 60, 'your-usd-currency-id', '20:00:00', '21:00:00', '{"popularity": 92, "best_time": "evening", "free": true}'),
('your-nyc-city-id', 'Metropolitan Museum of Art', 'Explore one of the world''s largest art museums', 'Museum', 25.00, 240, 'your-usd-currency-id', '10:00:00', '14:00:00', '{"popularity": 90, "best_time": "morning", "pay_what_you_wish": true}'),
('your-nyc-city-id', 'Broadway Show', 'Watch a world-class theatrical performance', 'Entertainment', 150.00, 150, 'your-usd-currency-id', '19:00:00', '21:30:00', '{"popularity": 85, "best_time": "evening", "reservation_required": true}');

-- London Activities
INSERT INTO public.activities (city_id, name, description, category, cost, duration_minutes, currency_id, start_time, end_time, metadata) VALUES
('your-london-city-id', 'Big Ben & Westminster Abbey', 'Visit the iconic clock tower and historic abbey', 'Landmark', 23.00, 120, 'your-usd-currency-id', '10:00:00', '12:00:00', '{"popularity": 93, "best_time": "morning", "guided_tour": true}'),
('your-london-city-id', 'British Museum', 'Explore world history and culture', 'Museum', 0.00, 180, 'your-usd-currency-id', '10:00:00', '13:00:00', '{"popularity": 88, "best_time": "morning", "free": true}'),
('your-london-city-id', 'Tower of London', 'Discover the historic castle and see the Crown Jewels', 'Castle', 29.90, 150, 'your-usd-currency-id', '09:00:00', '11:30:00', '{"popularity": 87, "best_time": "morning", "crowds": "high"}'),
('your-london-city-id', 'London Eye', 'Take a ride on the giant observation wheel', 'Sightseeing', 32.00, 30, 'your-usd-currency-id', '15:00:00', '15:30:00', '{"popularity": 82, "best_time": "afternoon", "weather_dependent": true}'),
('your-london-city-id', 'Buckingham Palace', 'Watch the Changing of the Guard ceremony', 'Royal', 0.00, 45, 'your-usd-currency-id', '11:00:00', '11:45:00', '{"popularity": 85, "best_time": "morning", "free": true}');

-- Tokyo Activities
INSERT INTO public.activities (city_id, name, description, category, cost, duration_minutes, currency_id, start_time, end_time, metadata) VALUES
('your-tokyo-city-id', 'Senso-ji Temple', 'Visit Tokyo''s oldest temple in Asakusa', 'Religious', 0.00, 90, 'your-usd-currency-id', '09:00:00', '10:30:00', '{"popularity": 88, "best_time": "morning", "free": true}'),
('your-tokyo-city-id', 'Shibuya Crossing', 'Experience the world''s busiest pedestrian crossing', 'Sightseeing', 0.00, 30, 'your-usd-currency-id', '18:00:00', '18:30:00', '{"popularity": 85, "best_time": "evening", "free": true}'),
('your-tokyo-city-id', 'Tokyo Skytree', 'Visit the tallest tower in Japan', 'Landmark', 25.00, 120, 'your-usd-currency-id', '14:00:00', '16:00:00', '{"popularity": 80, "best_time": "afternoon", "weather_dependent": true}'),
('your-tokyo-city-id', 'Tsukiji Outer Market', 'Explore the famous fish market area', 'Food', 0.00, 120, 'your-usd-currency-id', '08:00:00', '10:00:00', '{"popularity": 82, "best_time": "morning", "free": true}'),
('your-tokyo-city-id', 'Meiji Shrine', 'Visit the peaceful Shinto shrine in Yoyogi Park', 'Religious', 0.00, 90, 'your-usd-currency-id', '09:00:00', '10:30:00', '{"popularity": 85, "best_time": "morning", "free": true}');

-- Rome Activities
INSERT INTO public.activities (city_id, name, description, category, cost, duration_minutes, currency_id, start_time, end_time, metadata) VALUES
('your-rome-city-id', 'Colosseum Tour', 'Explore the ancient Roman amphitheater', 'Historical', 16.00, 120, 'your-usd-currency-id', '09:00:00', '11:00:00', '{"popularity": 95, "best_time": "morning", "skip_line": true}'),
('your-rome-city-id', 'Vatican Museums & Sistine Chapel', 'Visit the world-famous art collections', 'Museum', 17.00, 180, 'your-usd-currency-id', '09:00:00', '12:00:00', '{"popularity": 92, "best_time": "morning", "dress_code": "modest"}'),
('your-rome-city-id', 'Trevi Fountain', 'Throw a coin and make a wish', 'Landmark', 0.00, 30, 'your-usd-currency-id', '08:00:00', '08:30:00', '{"popularity": 90, "best_time": "early_morning", "free": true}'),
('your-rome-city-id', 'Roman Forum', 'Walk through ancient Roman ruins', 'Historical', 16.00, 90, 'your-usd-currency-id', '10:00:00', '11:30:00', '{"popularity": 85, "best_time": "morning", "combined_ticket": true}'),
('your-rome-city-id', 'Pantheon', 'Visit the ancient Roman temple', 'Historical', 0.00, 45, 'your-usd-currency-id', '09:00:00', '09:45:00', '{"popularity": 88, "best_time": "morning", "free": true}');

-- IMPORTANT NOTES:
-- 1. Replace 'your-paris-city-id', 'your-nyc-city-id', etc. with actual city IDs from your cities table
-- 2. Replace 'your-usd-currency-id' with the actual USD currency ID from your currencies table
-- 3. Adjust costs and durations based on your needs
-- 4. You may want to add more cities and activities based on your target market
-- 5. Consider adding more metadata fields for better filtering and recommendations

-- To find your city IDs, run:
-- SELECT id, name, country FROM cities WHERE name IN ('Paris', 'New York', 'London', 'Tokyo', 'Rome');

-- To find your USD currency ID, run:
-- SELECT id, code, name FROM currencies WHERE code = 'USD';
