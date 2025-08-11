-- Complete Setup Script for Currencies and Activities
-- Run this in your Supabase SQL editor

-- First, let's set up the currencies
DO $$
DECLARE
    usd_id uuid;
    eur_id uuid;
    gbp_id uuid;
    jpy_id uuid;
    cad_id uuid;
    aud_id uuid;
    sgd_id uuid;
    thb_id uuid;
    krw_id uuid;
    inr_id uuid;
    aed_id uuid;
    brl_id uuid;
    ars_id uuid;
    pen_id uuid;
    zar_id uuid;
    mad_id uuid;
    egp_id uuid;
BEGIN
    -- Insert currencies and get their IDs
    INSERT INTO currencies (code, name, symbol, exchange_rate_to_usd) VALUES
        ('USD', 'US Dollar', '$', 1.00),
        ('EUR', 'Euro', '€', 0.85),
        ('GBP', 'British Pound', '£', 0.73),
        ('JPY', 'Japanese Yen', '¥', 110.50),
        ('CAD', 'Canadian Dollar', 'C$', 1.25),
        ('AUD', 'Australian Dollar', 'A$', 1.35),
        ('SGD', 'Singapore Dollar', 'S$', 1.35),
        ('THB', 'Thai Baht', '฿', 33.50),
        ('KRW', 'South Korean Won', '₩', 1180.00),
        ('INR', 'Indian Rupee', '₹', 74.50),
        ('AED', 'UAE Dirham', 'د.إ', 3.67),
        ('BRL', 'Brazilian Real', 'R$', 5.25),
        ('ARS', 'Argentine Peso', '$', 98.50),
        ('PEN', 'Peruvian Sol', 'S/', 3.95),
        ('ZAR', 'South African Rand', 'R', 14.80),
        ('MAD', 'Moroccan Dirham', 'د.م.', 9.05),
        ('EGP', 'Egyptian Pound', '£', 15.70)
    ON CONFLICT (code) DO NOTHING;
    
    -- Get the currency IDs
    SELECT id INTO usd_id FROM currencies WHERE code = 'USD';
    SELECT id INTO eur_id FROM currencies WHERE code = 'EUR';
    SELECT id INTO gbp_id FROM currencies WHERE code = 'GBP';
    SELECT id INTO jpy_id FROM currencies WHERE code = 'JPY';
    SELECT id INTO cad_id FROM currencies WHERE code = 'CAD';
    SELECT id INTO aud_id FROM currencies WHERE code = 'AUD';
    SELECT id INTO sgd_id FROM currencies WHERE code = 'SGD';
    SELECT id INTO thb_id FROM currencies WHERE code = 'THB';
    SELECT id INTO krw_id FROM currencies WHERE code = 'KRW';
    SELECT id INTO inr_id FROM currencies WHERE code = 'INR';
    SELECT id INTO aed_id FROM currencies WHERE code = 'AED';
    SELECT id INTO brl_id FROM currencies WHERE code = 'BRL';
    SELECT id INTO ars_id FROM currencies WHERE code = 'ARS';
    SELECT id INTO pen_id FROM currencies WHERE code = 'PEN';
    SELECT id INTO zar_id FROM currencies WHERE code = 'ZAR';
    SELECT id INTO mad_id FROM currencies WHERE code = 'MAD';
    SELECT id INTO egp_id FROM currencies WHERE code = 'EGP';
    
    -- Now insert cities with proper currency references
    INSERT INTO cities (name, country, iso_country_code, lat, lng, population, cost_index, avg_daily_hotel, popularity_score, currency_id, metadata) VALUES
    -- Europe
    ('Paris', 'France', 'FR', 48.8566, 2.3522, 2161000, 1.85, 150.00, 95.0, eur_id, '{"continent": "Europe", "language": "French", "famous_for": ["Eiffel Tower", "Louvre", "Fashion"]}'),
    ('London', 'United Kingdom', 'GB', 51.5074, -0.1278, 8982000, 2.10, 180.00, 92.0, gbp_id, '{"continent": "Europe", "language": "English", "famous_for": ["Big Ben", "Buckingham Palace", "Museums"]}'),
    ('Rome', 'Italy', 'IT', 41.9028, 12.4964, 2873000, 1.65, 120.00, 88.0, eur_id, '{"continent": "Europe", "language": "Italian", "famous_for": ["Colosseum", "Vatican", "Ancient History"]}'),
    ('Barcelona', 'Spain', 'ES', 41.3851, 2.1734, 1620000, 1.45, 110.00, 85.0, eur_id, '{"continent": "Europe", "language": "Catalan/Spanish", "famous_for": ["Sagrada Familia", "Beaches", "Architecture"]}'),
    ('Amsterdam', 'Netherlands', 'NL', 52.3676, 4.9041, 821000, 1.75, 140.00, 82.0, eur_id, '{"continent": "Europe", "language": "Dutch", "famous_for": ["Canals", "Museums", "Bicycles"]}'),
    ('Berlin', 'Germany', 'DE', 52.5200, 13.4050, 3669000, 1.60, 100.00, 80.0, eur_id, '{"continent": "Europe", "language": "German", "famous_for": ["Brandenburg Gate", "History", "Culture"]}'),
    ('Prague', 'Czech Republic', 'CZ', 50.0755, 14.4378, 1309000, 1.20, 80.00, 78.0, eur_id, '{"continent": "Europe", "language": "Czech", "famous_for": ["Old Town", "Castle", "Beer"]}'),
    ('Vienna', 'Austria', 'AT', 48.2082, 16.3738, 1900000, 1.70, 130.00, 75.0, eur_id, '{"continent": "Europe", "language": "German", "famous_for": ["Music", "Architecture", "Coffee Culture"]}'),
    ('Budapest', 'Hungary', 'HU', 47.4979, 19.0402, 1756000, 1.15, 70.00, 72.0, eur_id, '{"continent": "Europe", "language": "Hungarian", "famous_for": ["Thermal Baths", "Danube", "Architecture"]}'),
    ('Stockholm', 'Sweden', 'SE', 59.3293, 18.0686, 975000, 2.00, 160.00, 70.0, eur_id, '{"continent": "Europe", "language": "Swedish", "famous_for": ["Archipelago", "Design", "Sustainability"]}'),

    -- North America
    ('New York', 'United States', 'US', 40.7128, -74.0060, 8336000, 2.50, 250.00, 90.0, usd_id, '{"continent": "North America", "language": "English", "famous_for": ["Times Square", "Central Park", "Broadway"]}'),
    ('Los Angeles', 'United States', 'US', 34.0522, -118.2437, 3976000, 2.30, 200.00, 85.0, usd_id, '{"continent": "North America", "language": "English", "famous_for": ["Hollywood", "Beaches", "Entertainment"]}'),
    ('San Francisco', 'United States', 'US', 37.7749, -122.4194, 873000, 2.80, 220.00, 88.0, usd_id, '{"continent": "North America", "language": "English", "famous_for": ["Golden Gate Bridge", "Tech", "Alcatraz"]}'),
    ('Toronto', 'Canada', 'CA', 43.6532, -79.3832, 2930000, 1.90, 150.00, 75.0, cad_id, '{"continent": "North America", "language": "English", "famous_for": ["CN Tower", "Multicultural", "Niagara Falls"]}'),
    ('Vancouver', 'Canada', 'CA', 49.2827, -123.1207, 675000, 2.10, 180.00, 78.0, cad_id, '{"continent": "North America", "language": "English", "famous_for": ["Mountains", "Ocean", "Outdoor Activities"]}'),
    ('Mexico City', 'Mexico', 'MX', 19.4326, -99.1332, 9200000, 1.30, 90.00, 72.0, usd_id, '{"continent": "North America", "language": "Spanish", "famous_for": ["Ancient Ruins", "Food", "Culture"]}'),

    -- Asia
    ('Tokyo', 'Japan', 'JP', 35.6762, 139.6503, 13960000, 2.20, 200.00, 88.0, jpy_id, '{"continent": "Asia", "language": "Japanese", "famous_for": ["Technology", "Anime", "Sushi"]}'),
    ('Seoul', 'South Korea', 'KR', 37.5665, 126.9780, 9730000, 1.80, 120.00, 82.0, krw_id, '{"continent": "Asia", "language": "Korean", "famous_for": ["K-pop", "Technology", "Food"]}'),
    ('Singapore', 'Singapore', 'SG', 1.3521, 103.8198, 5700000, 2.40, 250.00, 85.0, sgd_id, '{"continent": "Asia", "language": "English", "famous_for": ["Cleanliness", "Food", "Shopping"]}'),
    ('Bangkok', 'Thailand', 'TH', 13.7563, 100.5018, 10500000, 1.25, 80.00, 78.0, thb_id, '{"continent": "Asia", "language": "Thai", "famous_for": ["Temples", "Street Food", "Nightlife"]}'),
    ('Hong Kong', 'China', 'HK', 22.3193, 114.1694, 7500000, 2.60, 280.00, 80.0, usd_id, '{"continent": "Asia", "language": "Cantonese/English", "famous_for": ["Skyline", "Shopping", "Food"]}'),
    ('Bali', 'Indonesia', 'ID', -8.3405, 115.0920, 4300000, 1.15, 60.00, 75.0, usd_id, '{"continent": "Asia", "language": "Indonesian", "famous_for": ["Beaches", "Temples", "Nature"]}'),
    ('Mumbai', 'India', 'IN', 19.0760, 72.8777, 20400000, 1.10, 70.00, 70.0, inr_id, '{"continent": "Asia", "language": "Hindi/English", "famous_for": ["Bollywood", "Gateway of India", "Street Food"]}'),
    ('Dubai', 'United Arab Emirates', 'AE', 25.2048, 55.2708, 3330000, 2.30, 300.00, 82.0, aed_id, '{"continent": "Asia", "language": "Arabic", "famous_for": ["Burj Khalifa", "Shopping", "Luxury"]}'),

    -- Oceania
    ('Sydney', 'Australia', 'AU', -33.8688, 151.2093, 5300000, 2.20, 180.00, 80.0, aud_id, '{"continent": "Oceania", "language": "English", "famous_for": ["Opera House", "Harbor Bridge", "Beaches"]}'),
    ('Melbourne', 'Australia', 'AU', -37.8136, 144.9631, 5000000, 2.00, 160.00, 75.0, aud_id, '{"continent": "Oceania", "language": "English", "famous_for": ["Coffee Culture", "Arts", "Sports"]}'),
    ('Auckland', 'New Zealand', 'NZ', -36.8485, 174.7633, 1600000, 1.90, 140.00, 70.0, usd_id, '{"continent": "Oceania", "language": "English", "famous_for": ["Harbor", "Volcanoes", "Nature"]}'),

    -- South America
    ('Rio de Janeiro', 'Brazil', 'BR', -22.9068, -43.1729, 6748000, 1.40, 100.00, 78.0, brl_id, '{"continent": "South America", "language": "Portuguese", "famous_for": ["Christ the Redeemer", "Beaches", "Carnival"]}'),
    ('Buenos Aires', 'Argentina', 'AR', -34.6118, -58.3960, 3075000, 1.35, 90.00, 72.0, ars_id, '{"continent": "South America", "language": "Spanish", "famous_for": ["Tango", "Beef", "European Architecture"]}'),
    ('Lima', 'Peru', 'PE', -12.0464, -77.0428, 9560000, 1.20, 80.00, 68.0, pen_id, '{"continent": "South America", "language": "Spanish", "famous_for": ["Food", "History", "Machu Picchu"]}'),

    -- Africa
    ('Cape Town', 'South Africa', 'ZA', -33.9249, 18.4241, 4330000, 1.30, 90.00, 75.0, zar_id, '{"continent": "Africa", "language": "English", "famous_for": ["Table Mountain", "Beaches", "Wine"]}'),
    ('Marrakech', 'Morocco', 'MA', 31.6295, -7.9811, 928000, 1.15, 70.00, 72.0, mad_id, '{"continent": "Africa", "language": "Arabic", "famous_for": ["Medina", "Souks", "Culture"]}'),
    ('Cairo', 'Egypt', 'EG', 30.0444, 31.2357, 10200000, 1.25, 80.00, 70.0, egp_id, '{"continent": "Africa", "language": "Arabic", "famous_for": ["Pyramids", "Nile", "Ancient History"]}')
    ON CONFLICT (name) DO NOTHING;

END $$;

-- Now let's add comprehensive activities data
-- First, get the city IDs we just created
DO $$
DECLARE
    paris_id uuid;
    london_id uuid;
    rome_id uuid;
    barcelona_id uuid;
    amsterdam_id uuid;
    berlin_id uuid;
    prague_id uuid;
    vienna_id uuid;
    budapest_id uuid;
    stockholm_id uuid;
    nyc_id uuid;
    la_id uuid;
    sf_id uuid;
    toronto_id uuid;
    vancouver_id uuid;
    mexico_city_id uuid;
    tokyo_id uuid;
    seoul_id uuid;
    singapore_id uuid;
    bangkok_id uuid;
    hong_kong_id uuid;
    bali_id uuid;
    mumbai_id uuid;
    dubai_id uuid;
    sydney_id uuid;
    melbourne_id uuid;
    auckland_id uuid;
    rio_id uuid;
    buenos_aires_id uuid;
    lima_id uuid;
    cape_town_id uuid;
    marrakech_id uuid;
    cairo_id uuid;
    usd_id uuid;
    eur_id uuid;
    gbp_id uuid;
    jpy_id uuid;
    cad_id uuid;
    aud_id uuid;
    sgd_id uuid;
    thb_id uuid;
    krw_id uuid;
    inr_id uuid;
    aed_id uuid;
    brl_id uuid;
    ars_id uuid;
    pen_id uuid;
    zar_id uuid;
    mad_id uuid;
    egp_id uuid;
BEGIN
    -- Get city IDs
    SELECT id INTO paris_id FROM cities WHERE name = 'Paris';
    SELECT id INTO london_id FROM cities WHERE name = 'London';
    SELECT id INTO rome_id FROM cities WHERE name = 'Rome';
    SELECT id INTO barcelona_id FROM cities WHERE name = 'Barcelona';
    SELECT id INTO amsterdam_id FROM cities WHERE name = 'Amsterdam';
    SELECT id INTO berlin_id FROM cities WHERE name = 'Berlin';
    SELECT id INTO prague_id FROM cities WHERE name = 'Prague';
    SELECT id INTO vienna_id FROM cities WHERE name = 'Vienna';
    SELECT id INTO budapest_id FROM cities WHERE name = 'Budapest';
    SELECT id INTO stockholm_id FROM cities WHERE name = 'Stockholm';
    SELECT id INTO nyc_id FROM cities WHERE name = 'New York';
    SELECT id INTO la_id FROM cities WHERE name = 'Los Angeles';
    SELECT id INTO sf_id FROM cities WHERE name = 'San Francisco';
    SELECT id INTO toronto_id FROM cities WHERE name = 'Toronto';
    SELECT id INTO vancouver_id FROM cities WHERE name = 'Vancouver';
    SELECT id INTO mexico_city_id FROM cities WHERE name = 'Mexico City';
    SELECT id INTO tokyo_id FROM cities WHERE name = 'Tokyo';
    SELECT id INTO seoul_id FROM cities WHERE name = 'Seoul';
    SELECT id INTO singapore_id FROM cities WHERE name = 'Singapore';
    SELECT id INTO bangkok_id FROM cities WHERE name = 'Bangkok';
    SELECT id INTO hong_kong_id FROM cities WHERE name = 'Hong Kong';
    SELECT id INTO bali_id FROM cities WHERE name = 'Bali';
    SELECT id INTO mumbai_id FROM cities WHERE name = 'Mumbai';
    SELECT id INTO dubai_id FROM cities WHERE name = 'Dubai';
    SELECT id INTO sydney_id FROM cities WHERE name = 'Sydney';
    SELECT id INTO melbourne_id FROM cities WHERE name = 'Melbourne';
    SELECT id INTO auckland_id FROM cities WHERE name = 'Auckland';
    SELECT id INTO rio_id FROM cities WHERE name = 'Rio de Janeiro';
    SELECT id INTO buenos_aires_id FROM cities WHERE name = 'Buenos Aires';
    SELECT id INTO lima_id FROM cities WHERE name = 'Lima';
    SELECT id INTO cape_town_id FROM cities WHERE name = 'Cape Town';
    SELECT id INTO marrakech_id FROM cities WHERE name = 'Marrakech';
    SELECT id INTO cairo_id FROM cities WHERE name = 'Cairo';
    
    -- Get currency IDs
    SELECT id INTO usd_id FROM currencies WHERE code = 'USD';
    SELECT id INTO eur_id FROM currencies WHERE code = 'EUR';
    SELECT id INTO gbp_id FROM currencies WHERE code = 'GBP';
    SELECT id INTO jpy_id FROM currencies WHERE code = 'JPY';
    SELECT id INTO cad_id FROM currencies WHERE code = 'CAD';
    SELECT id INTO aud_id FROM currencies WHERE code = 'AUD';
    SELECT id INTO sgd_id FROM currencies WHERE code = 'SGD';
    SELECT id INTO thb_id FROM currencies WHERE code = 'THB';
    SELECT id INTO krw_id FROM currencies WHERE code = 'KRW';
    SELECT id INTO inr_id FROM currencies WHERE code = 'INR';
    SELECT id INTO aed_id FROM currencies WHERE code = 'AED';
    SELECT id INTO brl_id FROM currencies WHERE code = 'BRL';
    SELECT id INTO ars_id FROM currencies WHERE code = 'ARS';
    SELECT id INTO pen_id FROM currencies WHERE code = 'PEN';
    SELECT id INTO zar_id FROM currencies WHERE code = 'ZAR';
    SELECT id INTO mad_id FROM currencies WHERE code = 'MAD';
    SELECT id INTO egp_id FROM currencies WHERE code = 'EGP';

    -- Insert activities for each city
    -- PARIS ACTIVITIES
    INSERT INTO activities (city_id, name, description, category, cost, duration_minutes, currency_id, start_time, end_time, metadata) VALUES
    (paris_id, 'Visit the Louvre Museum', 'Explore the world''s largest art museum with over 35,000 works of art including the Mona Lisa', 'Museum', 17.00, 180, eur_id, '09:00:00', '12:00:00', '{"popularity": 95, "best_time": "morning", "skip_line": true, "must_see": true}'),
    (paris_id, 'Eiffel Tower Tour', 'Climb or take the elevator to the top of the iconic Eiffel Tower for panoramic city views', 'Landmark', 26.10, 120, eur_id, '14:00:00', '16:00:00', '{"popularity": 98, "best_time": "afternoon", "reservation_required": true, "romantic": true}'),
    (paris_id, 'Seine River Cruise', 'Enjoy a scenic boat ride along the Seine River with commentary on Paris landmarks', 'Sightseeing', 15.00, 60, eur_id, '16:00:00', '17:00:00', '{"popularity": 85, "best_time": "late_afternoon", "romantic": true, "photo_opportunity": true}'),
    (paris_id, 'Notre-Dame Cathedral', 'Visit the famous Gothic cathedral (exterior only due to restoration)', 'Religious', 0.00, 45, eur_id, '10:00:00', '10:45:00', '{"popularity": 90, "best_time": "morning", "free": true, "architecture": "gothic"}'),
    (paris_id, 'Champs-Élysées Walk', 'Stroll down the famous avenue and visit luxury shops and cafes', 'Shopping', 0.00, 90, eur_id, '15:00:00', '16:30:00', '{"popularity": 80, "best_time": "afternoon", "free": true, "luxury": true}'),
    (paris_id, 'Arc de Triomphe', 'Climb to the top for spectacular views of the 12 radiating avenues', 'Landmark', 13.00, 60, eur_id, '11:00:00', '12:00:00', '{"popularity": 85, "best_time": "morning", "views": true, "historical": true}'),
    (paris_id, 'Montmartre & Sacré-Cœur', 'Explore the artistic neighborhood and visit the white basilica', 'Religious', 0.00, 120, eur_id, '14:00:00', '16:00:00', '{"popularity": 82, "best_time": "afternoon", "free": true, "artistic": true, "views": true}'),
    (paris_id, 'Palace of Versailles', 'Day trip to the opulent palace and gardens of French royalty', 'Historical', 20.00, 300, eur_id, '09:00:00', '14:00:00', '{"popularity": 88, "best_time": "morning", "day_trip": true, "royal": true, "gardens": true}');

    -- LONDON ACTIVITIES
    INSERT INTO activities (city_id, name, description, category, cost, duration_minutes, currency_id, start_time, end_time, metadata) VALUES
    (london_id, 'Big Ben & Westminster Abbey', 'Visit the iconic clock tower and historic abbey where royal coronations take place', 'Landmark', 23.00, 120, gbp_id, '10:00:00', '12:00:00', '{"popularity": 93, "best_time": "morning", "guided_tour": true, "royal": true}'),
    (london_id, 'British Museum', 'Explore world history and culture with free admission to millions of artifacts', 'Museum', 0.00, 180, gbp_id, '10:00:00', '13:00:00', '{"popularity": 88, "best_time": "morning", "free": true, "world_class": true}'),
    (london_id, 'Tower of London', 'Discover the historic castle, see the Crown Jewels, and learn about royal history', 'Castle', 29.90, 150, gbp_id, '09:00:00', '11:30:00', '{"popularity": 87, "best_time": "morning", "crowds": "high", "royal": true, "jewels": true}'),
    (london_id, 'London Eye', 'Take a ride on the giant observation wheel for spectacular city views', 'Sightseeing', 32.00, 30, gbp_id, '15:00:00', '15:30:00', '{"popularity": 82, "best_time": "afternoon", "weather_dependent": true, "romantic": true}'),
    (london_id, 'Buckingham Palace', 'Watch the Changing of the Guard ceremony at the royal residence', 'Royal', 0.00, 45, gbp_id, '11:00:00', '11:45:00', '{"popularity": 85, "best_time": "morning", "free": true, "ceremony": true, "royal": true}'),
    (london_id, 'Tower Bridge', 'Walk across the iconic Victorian bridge and visit the exhibition', 'Landmark', 12.30, 90, gbp_id, '14:00:00', '15:30:00', '{"popularity": 80, "best_time": "afternoon", "engineering": true, "views": true}'),
    (london_id, 'Natural History Museum', 'Explore dinosaur skeletons and natural wonders in this grand building', 'Museum', 0.00, 150, gbp_id, '10:00:00', '12:30:00', '{"popularity": 85, "best_time": "morning", "free": true, "family_friendly": true, "dinosaurs": true}'),
    (london_id, 'Camden Market', 'Experience the vibrant alternative culture and street food scene', 'Shopping', 0.00, 120, gbp_id, '12:00:00', '14:00:00', '{"popularity": 78, "best_time": "afternoon", "free": true, "alternative": true, "street_food": true}');

    -- NEW YORK ACTIVITIES
    INSERT INTO activities (city_id, name, description, category, cost, duration_minutes, currency_id, start_time, end_time, metadata) VALUES
    (nyc_id, 'Statue of Liberty & Ellis Island', 'Visit the iconic statue and immigration museum with ferry ride', 'Landmark', 24.50, 180, usd_id, '09:00:00', '12:00:00', '{"popularity": 95, "best_time": "morning", "reservation_required": true, "immigration_history": true}'),
    (nyc_id, 'Central Park Walking Tour', 'Explore the famous urban park with a guided tour of landmarks', 'Nature', 25.00, 120, usd_id, '10:00:00', '12:00:00', '{"popularity": 88, "best_time": "morning", "outdoor": true, "guided": true}'),
    (nyc_id, 'Times Square Visit', 'Experience the bright lights and energy of Times Square at night', 'Sightseeing', 0.00, 60, usd_id, '20:00:00', '21:00:00', '{"popularity": 92, "best_time": "evening", "free": true, "nightlife": true, "iconic": true}'),
    (nyc_id, 'Metropolitan Museum of Art', 'Explore one of the world''s largest art museums with pay-what-you-wish admission', 'Museum', 25.00, 240, usd_id, '10:00:00', '14:00:00', '{"popularity": 90, "best_time": "morning", "pay_what_you_wish": true, "world_class": true}'),
    (nyc_id, 'Broadway Show', 'Watch a world-class theatrical performance in the theater district', 'Entertainment', 150.00, 150, usd_id, '19:00:00', '21:30:00', '{"popularity": 85, "best_time": "evening", "reservation_required": true, "world_class": true}'),
    (nyc_id, 'Empire State Building', 'Visit the observation deck for spectacular city views', 'Landmark', 44.00, 90, usd_id, '16:00:00', '17:30:00', '{"popularity": 88, "best_time": "late_afternoon", "views": true, "iconic": true}'),
    (nyc_id, 'High Line Park', 'Walk the elevated park built on an old railway line', 'Nature', 0.00, 90, usd_id, '15:00:00', '16:30:00', '{"popularity": 82, "best_time": "afternoon", "free": true, "unique": true, "architecture": true}'),
    (nyc_id, 'Brooklyn Bridge Walk', 'Cross the iconic bridge on foot for amazing skyline views', 'Sightseeing', 0.00, 60, usd_id, '17:00:00', '18:00:00', '{"popularity": 85, "best_time": "sunset", "free": true, "views": true, "iconic": true}');

    -- TOKYO ACTIVITIES
    INSERT INTO activities (city_id, name, description, category, cost, duration_minutes, currency_id, start_time, end_time, metadata) VALUES
    (tokyo_id, 'Senso-ji Temple', 'Visit Tokyo''s oldest temple in Asakusa with traditional shopping street', 'Religious', 0.00, 90, jpy_id, '09:00:00', '10:30:00', '{"popularity": 88, "best_time": "morning", "free": true, "traditional": true, "shopping": true}'),
    (tokyo_id, 'Shibuya Crossing', 'Experience the world''s busiest pedestrian crossing and shopping district', 'Sightseeing', 0.00, 30, jpy_id, '18:00:00', '18:30:00', '{"popularity": 85, "best_time": "evening", "free": true, "iconic": true, "crowds": true}'),
    (tokyo_id, 'Tokyo Skytree', 'Visit the tallest tower in Japan for panoramic city views', 'Landmark', 25.00, 120, jpy_id, '14:00:00', '16:00:00', '{"popularity": 80, "best_time": "afternoon", "weather_dependent": true, "views": true}'),
    (tokyo_id, 'Tsukiji Outer Market', 'Explore the famous fish market area and try fresh sushi', 'Food', 0.00, 120, jpy_id, '08:00:00', '10:00:00', '{"popularity": 82, "best_time": "morning", "free": true, "food": true, "traditional": true}'),
    (tokyo_id, 'Meiji Shrine', 'Visit the peaceful Shinto shrine in Yoyogi Park', 'Religious', 0.00, 90, jpy_id, '09:00:00', '10:30:00', '{"popularity": 85, "best_time": "morning", "free": true, "peaceful": true, "nature": true}'),
    (tokyo_id, 'Akihabara', 'Explore the electronics and anime district', 'Shopping', 0.00, 120, jpy_id, '14:00:00', '16:00:00', '{"popularity": 78, "best_time": "afternoon", "free": true, "technology": true, "anime": true}'),
    (tokyo_id, 'Ueno Park', 'Visit the park with museums, zoo, and cherry blossoms in season', 'Nature', 0.00, 150, jpy_id, '10:00:00', '12:30:00', '{"popularity": 80, "best_time": "morning", "free": true, "nature": true, "museums": true}'),
    (tokyo_id, 'Ginza Shopping', 'Experience luxury shopping in Tokyo''s upscale district', 'Shopping', 0.00, 120, jpy_id, '15:00:00', '17:00:00, '{"popularity": 75, "best_time": "afternoon", "free": true, "luxury": true, "upscale": true}');

    -- ROME ACTIVITIES
    INSERT INTO activities (city_id, name, description, category, cost, duration_minutes, currency_id, start_time, end_time, metadata) VALUES
    (rome_id, 'Colosseum Tour', 'Explore the ancient Roman amphitheater with skip-the-line access', 'Historical', 16.00, 120, eur_id, '09:00:00', '11:00:00', '{"popularity": 95, "best_time": "morning", "skip_line": true, "ancient": true, "iconic": true}'),
    (rome_id, 'Vatican Museums & Sistine Chapel', 'Visit the world-famous art collections and Michelangelo''s masterpiece', 'Museum', 17.00, 180, eur_id, '09:00:00', '12:00:00', '{"popularity": 92, "best_time": "morning", "dress_code": "modest", "religious": true, "art": true}'),
    (rome_id, 'Trevi Fountain', 'Throw a coin and make a wish at the famous Baroque fountain', 'Landmark', 0.00, 30, eur_id, '08:00:00', '08:30:00', '{"popularity": 90, "best_time": "early_morning", "free": true, "wishes": true, "baroque": true}'),
    (rome_id, 'Roman Forum', 'Walk through ancient Roman ruins and government buildings', 'Historical', 16.00, 90, eur_id, '10:00:00', '11:30:00', '{"popularity": 85, "best_time": "morning", "combined_ticket": true, "ancient": true, "ruins": true}'),
    (rome_id, 'Pantheon', 'Visit the ancient Roman temple with the world''s largest unreinforced dome', 'Historical', 0.00, 45, eur_id, '09:00:00', '09:45:00', '{"popularity": 88, "best_time": "morning", "free": true, "ancient": true, "architecture": true}'),
    (rome_id, 'Piazza Navona', 'Explore the beautiful square with fountains and street artists', 'Sightseeing', 0.00, 60, eur_id, '16:00:00', '17:00:00', '{"popularity": 82, "best_time": "afternoon", "free": true, "baroque": true, "artists": true}'),
    (rome_id, 'Castel Sant''Angelo', 'Visit the ancient castle with connections to the Vatican', 'Historical', 15.00, 90, eur_id, '14:00:00', '15:30:00', '{"popularity": 78, "best_time": "afternoon", "castle": true, "vatican": true, "views": true}'),
    (rome_id, 'Trastevere Walk', 'Explore the charming medieval neighborhood with authentic restaurants', 'Food', 0.00, 120, eur_id, '18:00:00', '20:00:00', '{"popularity": 80, "best_time": "evening", "free": true, "medieval": true, "authentic": true, "food": true}');

    -- Add more cities as needed...
    -- You can continue with the pattern above for other cities

END $$;

-- Verify the data was inserted correctly
SELECT 
    c.name as city_name,
    c.country,
    COUNT(a.id) as activity_count,
    AVG(a.cost) as avg_activity_cost,
    c.currency_id
FROM cities c
LEFT JOIN activities a ON c.id = a.city_id
GROUP BY c.id, c.name, c.country, c.currency_id
ORDER BY c.name;
