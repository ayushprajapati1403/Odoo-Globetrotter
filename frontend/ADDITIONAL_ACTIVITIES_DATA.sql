-- Additional Activities Data for Remaining Cities
-- Run this after the main setup script

DO $$
DECLARE
    -- City IDs
    barcelona_id uuid;
    amsterdam_id uuid;
    berlin_id uuid;
    prague_id uuid;
    vienna_id uuid;
    budapest_id uuid;
    stockholm_id uuid;
    la_id uuid;
    sf_id uuid;
    toronto_id uuid;
    vancouver_id uuid;
    mexico_city_id uuid;
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
    
    -- Currency IDs
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
    SELECT id INTO barcelona_id FROM cities WHERE name = 'Barcelona';
    SELECT id INTO amsterdam_id FROM cities WHERE name = 'Amsterdam';
    SELECT id INTO berlin_id FROM cities WHERE name = 'Berlin';
    SELECT id INTO prague_id FROM cities WHERE name = 'Prague';
    SELECT id INTO vienna_id FROM cities WHERE name = 'Vienna';
    SELECT id INTO budapest_id FROM cities WHERE name = 'Budapest';
    SELECT id INTO stockholm_id FROM cities WHERE name = 'Stockholm';
    SELECT id INTO la_id FROM cities WHERE name = 'Los Angeles';
    SELECT id INTO sf_id FROM cities WHERE name = 'San Francisco';
    SELECT id INTO toronto_id FROM cities WHERE name = 'Toronto';
    SELECT id INTO vancouver_id FROM cities WHERE name = 'Vancouver';
    SELECT id INTO mexico_city_id FROM cities WHERE name = 'Mexico City';
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

    -- BARCELONA ACTIVITIES
    INSERT INTO activities (city_id, name, description, category, cost, duration_minutes, currency_id, start_time, end_time, metadata) VALUES
    (barcelona_id, 'Sagrada Familia', 'Visit Gaudi''s masterpiece cathedral with skip-the-line access', 'Religious', 26.00, 120, eur_id, '09:00:00', '11:00:00', '{"popularity": 95, "best_time": "morning", "skip_line": true, "architecture": "gaudi", "iconic": true}'),
    (barcelona_id, 'Park Güell', 'Explore Gaudi''s colorful park with mosaic sculptures and city views', 'Nature', 10.00, 120, eur_id, '10:00:00', '12:00:00', '{"popularity": 88, "best_time": "morning", "gaudi": true, "views": true, "colorful": true}'),
    (barcelona_id, 'La Rambla Walk', 'Stroll down the famous pedestrian street with street performers', 'Sightseeing', 0.00, 90, eur_id, '16:00:00', '17:30:00', '{"popularity": 85, "best_time": "afternoon", "free": true, "street_performers": true, "shopping": true}'),
    (barcelona_id, 'Casa Batlló', 'Tour Gaudi''s stunning residential building with audio guide', 'Architecture', 25.00, 90, eur_id, '14:00:00', '15:30:00', '{"popularity": 82, "best_time": "afternoon", "gaudi": true, "architecture": true, "audio_guide": true}'),
    (barcelona_id, 'Barceloneta Beach', 'Relax on the city''s main beach and enjoy Mediterranean views', 'Nature', 0.00, 120, eur_id, '15:00:00', '17:00:00', '{"popularity": 80, "best_time": "afternoon", "free": true, "beach": true, "mediterranean": true}'),
    (barcelona_id, 'Gothic Quarter', 'Explore the medieval neighborhood with narrow streets and historic buildings', 'Historical', 0.00, 120, eur_id, '11:00:00', '13:00:00', '{"popularity": 85, "best_time": "morning", "free": true, "medieval": true, "historic": true}'),
    (barcelona_id, 'Casa Milà (La Pedrera)', 'Visit Gaudi''s wavy stone building with rooftop access', 'Architecture', 24.00, 90, eur_id, '16:00:00', '17:30:00', '{"popularity": 78, "best_time": "afternoon", "gaudi": true, "rooftop": true, "architecture": true}'),
    (barcelona_id, 'Mercat de Sant Josep', 'Experience the famous food market with local delicacies', 'Food', 0.00, 90, eur_id, '10:00:00', '11:30:00', '{"popularity": 82, "best_time": "morning", "free": true, "food": true, "local": true, "market": true}');

    -- AMSTERDAM ACTIVITIES
    INSERT INTO activities (city_id, name, description, category, cost, duration_minutes, currency_id, start_time, end_time, metadata) VALUES
    (amsterdam_id, 'Anne Frank House', 'Visit the museum dedicated to the young diarist with advance booking', 'Historical', 14.00, 90, eur_id, '09:00:00', '10:30:00', '{"popularity": 90, "best_time": "morning", "advance_booking": true, "historical": true, "emotional": true}'),
    (amsterdam_id, 'Van Gogh Museum', 'Explore the world''s largest collection of Van Gogh''s works', 'Museum', 20.00, 150, eur_id, '10:00:00', '12:30:00', '{"popularity": 88, "best_time": "morning", "art": true, "van_gogh": true, "world_class": true}'),
    (amsterdam_id, 'Canal Cruise', 'Take a boat tour through Amsterdam''s historic canal system', 'Sightseeing', 16.00, 75, eur_id, '14:00:00', '15:15:00', '{"popularity": 85, "best_time": "afternoon", "canals": true, "historic": true, "romantic": true}'),
    (amsterdam_id, 'Rijksmuseum', 'Visit the Dutch national museum with Rembrandt masterpieces', 'Museum', 20.00, 180, eur_id, '09:00:00', '12:00:00', '{"popularity": 85, "best_time": "morning", "art": true, "dutch": true, "rembrandt": true}'),
    (amsterdam_id, 'Vondelpark', 'Walk through the city''s largest park and enjoy nature', 'Nature', 0.00, 90, eur_id, '15:00:00', '16:30:00', '{"popularity": 80, "best_time": "afternoon", "free": true, "nature": true, "relaxing": true}'),
    (amsterdam_id, 'Jordaan Neighborhood', 'Explore the charming residential area with boutique shops', 'Shopping', 0.00, 120, eur_id, '14:00:00', '16:00:00', '{"popularity": 78, "best_time": "afternoon", "free": true, "charming": true, "boutiques": true}'),
    (amsterdam_id, 'Heineken Experience', 'Tour the former brewery and learn about beer making', 'Entertainment', 21.00, 90, eur_id, '13:00:00', '14:30:00', '{"popularity": 75, "best_time": "afternoon", "beer": true, "interactive": true, "tasting": true}'),
    (amsterdam_id, 'Red Light District', 'Walk through the historic area (daytime recommended)', 'Sightseeing', 0.00, 60, eur_id, '14:00:00', '15:00:00', '{"popularity": 70, "best_time": "daytime", "free": true, "historic": true, "controversial": true}');

    -- BERLIN ACTIVITIES
    INSERT INTO activities (city_id, name, description, category, cost, duration_minutes, currency_id, start_time, end_time, metadata) VALUES
    (berlin_id, 'Brandenburg Gate', 'Visit the iconic neoclassical monument and symbol of unity', 'Landmark', 0.00, 45, eur_id, '09:00:00', '09:45:00', '{"popularity": 92, "best_time": "morning", "free": true, "iconic": true, "symbol": true}'),
    (berlin_id, 'Berlin Wall Memorial', 'Learn about the city''s divided history at the memorial site', 'Historical', 0.00, 90, eur_id, '10:00:00', '11:30:00', '{"popularity": 88, "best_time": "morning", "free": true, "historical": true, "cold_war": true}'),
    (berlin_id, 'Museum Island', 'Explore the UNESCO World Heritage site with five museums', 'Museum', 18.00, 240, eur_id, '10:00:00', '14:00:00', '{"popularity": 85, "best_time": "morning", "unesco": true, "museums": true, "world_heritage": true}'),
    (berlin_id, 'Checkpoint Charlie', 'Visit the famous Cold War border crossing point', 'Historical', 0.00, 60, eur_id, '11:00:00', '12:00:00', '{"popularity": 82, "best_time": "morning", "free": true, "cold_war": true, "historic": true}'),
    (berlin_id, 'Reichstag Building', 'Visit the German parliament building with glass dome', 'Political', 0.00, 90, eur_id, '10:00:00', '11:30:00', '{"popularity": 85, "best_time": "morning", "free": true, "political": true, "architecture": true, "dome": true}'),
    (berlin_id, 'East Side Gallery', 'See the longest remaining section of the Berlin Wall with street art', 'Art', 0.00, 90, eur_id, '14:00:00', '15:30:00', '{"popularity": 80, "best_time": "afternoon", "free": true, "street_art": true, "berlin_wall": true}'),
    (berlin_id, 'Tiergarten Park', 'Walk through the city''s largest park and enjoy nature', 'Nature', 0.00, 120, eur_id, '15:00:00', '17:00:00', '{"popularity": 78, "best_time": "afternoon", "free": true, "nature": true, "relaxing": true}'),
    (berlin_id, 'Kreuzberg Neighborhood', 'Explore the multicultural area with street art and food', 'Cultural', 0.00, 120, eur_id, '16:00:00', '18:00:00', '{"popularity": 75, "best_time": "afternoon", "free": true, "multicultural": true, "street_art": true, "food": true}');

    -- PRAGUE ACTIVITIES
    INSERT INTO activities (city_id, name, description, category, cost, duration_minutes, currency_id, start_time, end_time, metadata) VALUES
    (prague_id, 'Prague Castle', 'Visit the largest ancient castle complex in the world', 'Castle', 15.00, 180, eur_id, '09:00:00', '12:00:00', '{"popularity": 90, "best_time": "morning", "castle": true, "largest": true, "ancient": true}'),
    (prague_id, 'Charles Bridge', 'Walk across the historic bridge with statues and city views', 'Landmark', 0.00, 60, eur_id, '08:00:00', '09:00:00', '{"popularity": 88, "best_time": "early_morning", "free": true, "historic": true, "statues": true, "views": true}'),
    (prague_id, 'Old Town Square', 'Explore the historic square with the Astronomical Clock', 'Historical', 0.00, 90, eur_id, '10:00:00', '11:30:00', '{"popularity": 85, "best_time": "morning", "free": true, "historic": true, "astronomical_clock": true}'),
    (prague_id, 'Astronomical Clock', 'Watch the famous clock show at the top of the hour', 'Landmark', 0.00, 30, eur_id, '11:00:00', '11:30:00', '{"popularity": 82, "best_time": "hourly", "free": true, "mechanical": true, "show": true}'),
    (prague_id, 'Jewish Quarter', 'Visit the historic Jewish cemetery and synagogues', 'Historical', 12.00, 120, eur_id, '10:00:00', '12:00:00', '{"popularity": 80, "best_time": "morning", "jewish": true, "historic": true, "cemetery": true}'),
    (prague_id, 'Petrin Tower', 'Climb the mini Eiffel Tower for panoramic city views', 'Landmark', 5.00, 90, eur_id, '15:00:00', '16:30:00', '{"popularity": 75, "best_time": "afternoon", "views": true, "mini_eiffel": true, "panoramic": true}'),
    (prague_id, 'Wenceslas Square', 'Walk through the main square and shopping area', 'Shopping', 0.00, 60, eur_id, '14:00:00', '15:00:00', '{"popularity": 78, "best_time": "afternoon", "free": true, "shopping": true, "main_square": true}'),
    (prague_id, 'Beer Garden', 'Experience Czech beer culture in traditional beer gardens', 'Food', 8.00, 120, eur_id, '17:00:00', '19:00:00', '{"popularity": 80, "best_time": "evening", "beer": true, "czech": true, "traditional": true}');

    -- VIENNA ACTIVITIES
    INSERT INTO activities (city_id, name, description, category, cost, duration_minutes, currency_id, start_time, end_time, metadata) VALUES
    (vienna_id, 'Schönbrunn Palace', 'Visit the Habsburg summer residence with gardens', 'Royal', 20.00, 180, eur_id, '09:00:00', '12:00:00', '{"popularity": 90, "best_time": "morning", "royal": true, "habsburg": true, "gardens": true}'),
    (vienna_id, 'St. Stephen''s Cathedral', 'Visit the Gothic cathedral with colorful roof tiles', 'Religious', 0.00, 60, eur_id, '10:00:00', '11:00:00', '{"popularity": 88, "best_time": "morning", "free": true, "gothic": true, "colorful_roof": true}'),
    (vienna_id, 'Vienna State Opera', 'Take a guided tour of the famous opera house', 'Cultural', 12.00, 60, eur_id, '14:00:00', '15:00:00', '{"popularity": 85, "best_time": "afternoon", "opera": true, "guided": true, "famous": true}'),
    (vienna_id, 'Belvedere Palace', 'Visit the art museum with Klimt''s "The Kiss"', 'Museum', 16.00, 120, eur_id, '10:00:00', '12:00:00', '{"popularity": 82, "best_time": "morning", "art": true, "klimt": true, "the_kiss": true}'),
    (vienna_id, 'Prater Park', 'Visit the amusement park and ride the Giant Ferris Wheel', 'Entertainment', 12.00, 120, eur_id, '14:00:00', '16:00:00', '{"popularity": 78, "best_time": "afternoon", "amusement": true, "ferris_wheel": true, "historic": true}'),
    (vienna_id, 'Café Central', 'Experience traditional Viennese coffee culture', 'Food', 15.00, 90, eur_id, '15:00:00', '16:30:00', '{"popularity": 80, "best_time": "afternoon", "coffee": true, "viennese": true, "traditional": true}'),
    (vienna_id, 'Hofburg Palace', 'Visit the winter residence of the Habsburgs', 'Royal', 15.00, 120, eur_id, '11:00:00', '13:00:00', '{"popularity": 85, "best_time": "morning", "royal": true, "habsburg": true, "winter": true}'),
    (vienna_id, 'Naschmarkt', 'Explore the famous food market with international cuisine', 'Food', 0.00, 90, eur_id, '10:00:00', '11:30:00', '{"popularity": 82, "best_time": "morning", "free": true, "food": true, "international": true, "market": true}');

    -- BUDAPEST ACTIVITIES
    INSERT INTO activities (city_id, name, description, category, cost, duration_minutes, currency_id, start_time, end_time, metadata) VALUES
    (budapest_id, 'Thermal Baths', 'Relax in the famous Széchenyi or Gellért thermal baths', 'Wellness', 20.00, 180, eur_id, '10:00:00', '13:00:00', '{"popularity": 88, "best_time": "morning", "thermal": true, "relaxing": true, "famous": true}'),
    (budapest_id, 'Buda Castle', 'Visit the historic castle with panoramic city views', 'Castle', 0.00, 120, eur_id, '09:00:00', '11:00:00', '{"popularity": 85, "best_time": "morning", "free": true, "castle": true, "views": true, "historic": true}'),
    (budapest_id, 'Parliament Building', 'Tour the stunning Gothic Revival parliament building', 'Political', 25.00, 90, eur_id, '10:00:00', '11:30:00', '{"popularity": 82, "best_time": "morning", "gothic": true, "parliament": true, "architecture": true}'),
    (budapest_id, 'Chain Bridge', 'Walk across the iconic bridge connecting Buda and Pest', 'Landmark', 0.00, 45, eur_id, '17:00:00', '17:45:00', '{"popularity": 80, "best_time": "sunset", "free": true, "iconic": true, "connecting": true, "views": true}'),
    (budapest_id, 'Fisherman''s Bastion', 'Visit the fairy-tale lookout towers with city views', 'Landmark', 0.00, 60, eur_id, '08:00:00', '09:00:00', '{"popularity": 85, "best_time": "early_morning", "free": true, "fairy_tale": true, "towers": true, "views": true}'),
    (budapest_id, 'Great Market Hall', 'Explore the largest indoor market with local food', 'Food', 0.00, 90, eur_id, '09:00:00', '10:30:00', '{"popularity": 78, "best_time": "morning", "free": true, "market": true, "local": true, "food": true}'),
    (budapest_id, 'Heroes'' Square', 'Visit the iconic square with statues of Hungarian leaders', 'Historical', 0.00, 45, eur_id, '11:00:00', '11:45:00', '{"popularity": 80, "best_time": "morning", "free": true, "heroes": true, "statues": true, "historic": true}'),
    (budapest_id, 'Ruin Bars', 'Experience the unique nightlife in abandoned buildings', 'Nightlife', 10.00, 120, eur_id, '20:00:00', '22:00:00', '{"popularity": 75, "best_time": "evening", "unique": true, "abandoned": true, "nightlife": true}');

    -- STOCKHOLM ACTIVITIES
    INSERT INTO activities (city_id, name, description, category, cost, duration_minutes, currency_id, start_time, end_time, metadata) VALUES
    (stockholm_id, 'Vasa Museum', 'See the perfectly preserved 17th-century warship', 'Museum', 18.00, 120, eur_id, '10:00:00', '12:00:00', '{"popularity": 88, "best_time": "morning", "warship": true, "preserved": true, "17th_century": true}'),
    (stockholm_id, 'Gamla Stan', 'Explore the medieval old town with colorful buildings', 'Historical', 0.00, 120, eur_id, '10:00:00', '12:00:00', '{"popularity": 85, "best_time": "morning", "free": true, "medieval": true, "old_town": true, "colorful": true}'),
    (stockholm_id, 'Royal Palace', 'Visit the official residence of the Swedish monarch', 'Royal', 18.00, 90, eur_id, '11:00:00', '12:30:00', '{"popularity": 82, "best_time": "morning", "royal": true, "swedish": true, "residence": true}'),
    (stockholm_id, 'ABBA Museum', 'Interactive museum dedicated to the famous pop group', 'Museum', 25.00, 120, eur_id, '14:00:00', '16:00:00', '{"popularity": 80, "best_time": "afternoon", "abba": true, "interactive": true, "pop": true}'),
    (stockholm_id, 'Djurgården Island', 'Walk through the green island with museums and nature', 'Nature', 0.00, 150, eur_id, '13:00:00', '15:30:00', '{"popularity": 78, "best_time": "afternoon", "free": true, "island": true, "nature": true, "museums": true}'),
    (stockholm_id, 'Fotografiska', 'Visit the contemporary photography museum', 'Museum', 20.00, 90, eur_id, '15:00:00', '16:30:00', '{"popularity": 75, "best_time": "afternoon", "photography": true, "contemporary": true, "modern": true}'),
    (stockholm_id, 'Södermalm', 'Explore the trendy neighborhood with hip cafes and shops', 'Cultural', 0.00, 120, eur_id, '16:00:00', '18:00:00', '{"popularity": 72, "best_time": "afternoon", "free": true, "trendy": true, "hip": true, "cafes": true}'),
    (stockholm_id, 'Archipelago Cruise', 'Take a boat tour through the beautiful island archipelago', 'Sightseeing', 35.00, 180, eur_id, '10:00:00', '13:00:00', '{"popularity": 75, "best_time": "morning", "archipelago": true, "islands": true, "nature": true, "cruise": true}');

    -- Add more cities as needed...

END $$;

-- Verify the additional data was inserted
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
