-- Insert dummy accommodation data for cities
-- Each city gets 2-3 accommodation options with realistic names and pricing

-- Rome, Italy
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('05c4114c-f150-49d0-8aa9-a1e7f365ef14', 'Marriott', 'Hotel Roma Marriott', 180.00, 'EUR', NULL),
('05c4114c-f150-49d0-8aa9-a1e7f365ef14', 'Hilton', 'Hilton Rome Airport', 150.00, 'EUR', NULL),
('05c4114c-f150-49d0-8aa9-a1e7f365ef14', 'Airbnb', 'Historic Center Apartment', 120.00, 'EUR', NULL);

-- Vienna, Austria
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('0e3cd3d3-18f8-4c16-a953-ae277d4e1ec9', 'InterContinental', 'InterContinental Vienna', 200.00, 'EUR', NULL),
('0e3cd3d3-18f8-4c16-a953-ae277d4e1ec9', 'Radisson', 'Radisson Blu Park Royal', 160.00, 'EUR', NULL),
('0e3cd3d3-18f8-4c16-a953-ae277d4e1ec9', 'Local', 'Hotel Sacher Vienna', 350.00, 'EUR', NULL);

-- Singapore
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('11c749d7-e581-4330-8bec-c2d7cc101954', 'Marina Bay Sands', 'Marina Bay Sands Hotel', 400.00, 'SGD', NULL),
('11c749d7-e581-4330-8bec-c2d7cc101954', 'Raffles', 'Raffles Hotel Singapore', 800.00, 'SGD', NULL),
('11c749d7-e581-4330-8bec-c2d7cc101954', 'Holiday Inn', 'Holiday Inn Express Orchard', 180.00, 'SGD', NULL);

-- Los Angeles, United States
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('146f5312-0d07-4f3c-821a-acbbc7124888', 'Beverly Hills Hotel', 'The Beverly Hills Hotel', 450.00, 'USD', NULL),
('146f5312-0d07-4f3c-821a-acbbc7124888', 'Marriott', 'JW Marriott LA Live', 280.00, 'USD', NULL),
('146f5312-0d07-4f3c-821a-acbbc7124888', 'Airbnb', 'Venice Beach House', 200.00, 'USD', NULL);

-- Sydney, Australia
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('168fc17d-1be9-475f-890e-e0eb934397d6', 'Four Seasons', 'Four Seasons Hotel Sydney', 350.00, 'AUD', NULL),
('168fc17d-1be9-475f-890e-e0eb934397d6', 'Hilton', 'Hilton Sydney', 220.00, 'AUD', NULL),
('168fc17d-1be9-475f-890e-e0eb934397d6', 'Local', 'Bondi Beach Resort', 180.00, 'AUD', NULL);

-- Berlin, Germany
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('213f8321-b099-469d-a781-93a762a14c5c', 'Adlon', 'Hotel Adlon Kempinski', 300.00, 'EUR', NULL),
('213f8321-b099-469d-a781-93a762a14c5c', 'Marriott', 'Berlin Marriott Hotel', 180.00, 'EUR', NULL),
('213f8321-b099-469d-a781-93a762a14c5c', 'Local', 'Hotel Zoo Berlin', 140.00, 'EUR', NULL);

-- Budapest, Hungary
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('250793ba-276d-4e40-a053-a6d1a1829a41', 'Four Seasons', 'Four Seasons Hotel Gresham Palace', 250.00, 'HUF', NULL),
('250793ba-276d-4e40-a053-a6d1a1829a41', 'Kempinski', 'Kempinski Hotel Corvinus', 180.00, 'HUF', NULL),
('250793ba-276d-4e40-a053-a6d1a1829a41', 'Local', 'Hotel Aria Budapest', 120.00, 'HUF', NULL);

-- Cairo, Egypt
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('25882b20-bc30-4090-93cd-2dd1090fcc6b', 'Nile Ritz-Carlton', 'The Nile Ritz-Carlton Cairo', 200.00, 'EGP', NULL),
('25882b20-bc30-4090-93cd-2dd1090fcc6b', 'Marriott', 'Cairo Marriott Hotel', 150.00, 'EGP', NULL),
('25882b20-bc30-4090-93cd-2dd1090fcc6b', 'Local', 'Mena House Hotel', 100.00, 'EGP', NULL);

-- Bangkok, Thailand
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('2a3e48d8-69a3-4aa2-8a7a-e3f0f9959ec2', 'Mandarin Oriental', 'Mandarin Oriental Bangkok', 350.00, 'THB', NULL),
('2a3e48d8-69a3-4aa2-8a7a-e3f0f9959ec2', 'Hilton', 'Hilton Sukhumvit Bangkok', 180.00, 'THB', NULL),
('2a3e48d8-69a3-4aa2-8a7a-e3f0f9959ec2', 'Local', 'Bangkok Marriott Hotel', 120.00, 'THB', NULL);

-- Mexico City, Mexico
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('2d50e778-5930-45f7-80f1-7268249dbef8', 'Four Seasons', 'Four Seasons Hotel Mexico City', 280.00, 'MXN', NULL),
('2d50e778-5930-45f7-80f1-7268249dbef8', 'Marriott', 'Mexico City Marriott', 180.00, 'MXN', NULL),
('2d50e778-5930-45f7-80f1-7268249dbef8', 'Local', 'Hotel Condesa DF', 120.00, 'MXN', NULL);

-- Marrakech, Morocco
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('2f783404-f74b-475b-8e36-eeced6bb0930', 'Royal Mansour', 'Royal Mansour Marrakech', 800.00, 'MAD', NULL),
('2f783404-f74b-475b-8e36-eeced6bb0930', 'Aman', 'Amanjena Marrakech', 600.00, 'MAD', NULL),
('2f783404-f74b-475b-8e36-eeced6bb0930', 'Local', 'Riad El Fenn', 200.00, 'MAD', NULL);

-- Prague, Czech Republic
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('3497ffca-e77c-4565-adc5-97dccea4c5f0', 'Four Seasons', 'Four Seasons Hotel Prague', 300.00, 'CZK', NULL),
('3497ffca-e77c-4565-adc5-97dccea4c5f0', 'Marriott', 'Prague Marriott Hotel', 200.00, 'CZK', NULL),
('3497ffca-e77c-4565-adc5-97dccea4c5f0', 'Local', 'Hotel Aria Prague', 150.00, 'CZK', NULL);

-- Toronto, Canada
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('3607d10a-8006-4499-aa5f-d378a1c5eb95', 'Four Seasons', 'Four Seasons Hotel Toronto', 350.00, 'CAD', NULL),
('3607d10a-8006-4499-aa5f-d378a1c5eb95', 'Ritz-Carlton', 'The Ritz-Carlton Toronto', 400.00, 'CAD', NULL),
('3607d10a-8006-4499-aa5f-d378a1c5eb95', 'Marriott', 'Toronto Marriott Downtown', 220.00, 'CAD', NULL);

-- Tokyo, Japan
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('37cf4ac2-cd44-4b72-8542-d6ec2d2b0934', 'Aman', 'Aman Tokyo', 1200.00, 'JPY', NULL),
('37cf4ac2-cd44-4b72-8542-d6ec2d2b0934', 'Four Seasons', 'Four Seasons Hotel Tokyo', 600.00, 'JPY', NULL),
('37cf4ac2-cd44-4b72-8542-d6ec2d2b0934', 'Hilton', 'Hilton Tokyo', 300.00, 'JPY', NULL);

-- Buenos Aires, Argentina
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('3aab3a11-b30b-4ed5-8e97-608e0c8061de', 'Four Seasons', 'Four Seasons Hotel Buenos Aires', 250.00, 'ARS', NULL),
('3aab3a11-b30b-4ed5-8e97-608e0c8061de', 'Marriott', 'Buenos Aires Marriott', 180.00, 'ARS', NULL),
('3aab3a11-b30b-4ed5-8e97-608e0c8061de', 'Local', 'Hotel Faena Buenos Aires', 200.00, 'ARS', NULL);

-- Amsterdam, Netherlands
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('444fd1e7-265c-486a-a06b-ceed09f434fc', 'Amstel', 'Hotel Amstel Amsterdam', 400.00, 'EUR', NULL),
('444fd1e7-265c-486a-a06b-ceed09f434fc', 'Marriott', 'Amsterdam Marriott Hotel', 250.00, 'EUR', NULL),
('444fd1e7-265c-486a-a06b-ceed09f434fc', 'Local', 'Conservatorium Hotel', 350.00, 'EUR', NULL);

-- San Francisco, United States
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('48b5ddc7-6d41-457e-8026-174136c6957b', 'Ritz-Carlton', 'The Ritz-Carlton San Francisco', 450.00, 'USD', NULL),
('48b5ddc7-6d41-457e-8026-174136c6957b', 'Four Seasons', 'Four Seasons Hotel San Francisco', 400.00, 'USD', NULL),
('48b5ddc7-6d41-457e-8026-174136c6957b', 'Marriott', 'San Francisco Marriott Marquis', 280.00, 'USD', NULL);

-- London, United Kingdom
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('4d9f48c8-7b3e-445a-a7a0-94519a509f96', 'Claridge''s', 'Claridge''s London', 600.00, 'GBP', NULL),
('4d9f48c8-7b3e-445a-a7a0-94519a509f96', 'Ritz', 'The Ritz London', 500.00, 'GBP', NULL),
('4d9f48c8-7b3e-445a-a7a0-94519a509f96', 'Marriott', 'London Marriott Hotel', 250.00, 'GBP', NULL);

-- Mumbai, India
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('637d3eab-f801-4e8f-ac0a-ed49814c6d5d', 'Taj', 'Taj Mahal Palace Mumbai', 300.00, 'INR', NULL),
('637d3eab-f801-4e8f-ac0a-ed49814c6d5d', 'Marriott', 'Mumbai Marriott Hotel', 180.00, 'INR', NULL),
('637d3eab-f801-4e8f-ac0a-ed49814c6d5d', 'Local', 'The Oberoi Mumbai', 250.00, 'INR', NULL);

-- Bali, Indonesia
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('68cf1fb1-4db4-45f8-aee7-bcca0bc0f5e6', 'Four Seasons', 'Four Seasons Resort Bali', 400.00, 'IDR', NULL),
('68cf1fb1-4db4-45f8-aee7-bcca0bc0f5e6', 'Aman', 'Aman Villas Bali', 600.00, 'IDR', NULL),
('68cf1fb1-4db4-45f8-aee7-bcca0bc0f5e6', 'Local', 'Hanging Gardens Bali', 200.00, 'IDR', NULL);

-- Dubai, United Arab Emirates
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('6fb58268-21c6-46ce-bfac-2ae8af44bd39', 'Burj Al Arab', 'Burj Al Arab Jumeirah', 1200.00, 'AED', NULL),
('6fb58268-21c6-46ce-bfac-2ae8af44bd39', 'Atlantis', 'Atlantis The Palm', 600.00, 'AED', NULL),
('6fb58268-21c6-46ce-bfac-2ae8af44bd39', 'Marriott', 'Dubai Marriott Harbour', 400.00, 'AED', NULL);

-- Barcelona, Spain
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('7322d048-0a62-4ef5-bda5-0adcfdc08599', 'Hotel Arts', 'Hotel Arts Barcelona', 350.00, 'EUR', NULL),
('7322d048-0a62-4ef5-bda5-0adcfdc08599', 'W Barcelona', 'W Barcelona', 300.00, 'EUR', NULL),
('7322d048-0a62-4ef5-bda5-0adcfdc08599', 'Marriott', 'Barcelona Marriott Hotel', 200.00, 'EUR', NULL);

-- Rio de Janeiro, Brazil
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('8cdd38a8-50c8-4ca7-8cef-fa57d0c57d43', 'Copacabana Palace', 'Copacabana Palace Hotel', 400.00, 'BRL', NULL),
('8cdd38a8-50c8-4ca7-8cef-fa57d0c57d43', 'Fasano', 'Hotel Fasano Rio de Janeiro', 350.00, 'BRL', NULL),
('8cdd38a8-50c8-4ca7-8cef-fa57d0c57d43', 'Marriott', 'Rio de Janeiro Marriott', 250.00, 'BRL', NULL);

-- Vancouver, Canada
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('bc27f682-3dad-4314-9182-05809fa848e4', 'Fairmont', 'Fairmont Pacific Rim Vancouver', 350.00, 'CAD', NULL),
('bc27f682-3dad-4314-9182-05809fa848e4', 'Four Seasons', 'Four Seasons Hotel Vancouver', 400.00, 'CAD', NULL),
('bc27f682-3dad-4314-9182-05809fa848e4', 'Marriott', 'Vancouver Marriott Pinnacle', 250.00, 'CAD', NULL);

-- Stockholm, Sweden
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('bf9f2e15-833e-4205-b226-208c02e260c2', 'Grand Hotel', 'Grand Hotel Stockholm', 300.00, 'SEK', NULL),
('bf9f2e15-833e-4205-b226-208c02e260c2', 'Nobis', 'Nobis Hotel Stockholm', 250.00, 'SEK', NULL),
('bf9f2e15-833e-4205-b226-208c02e260c2', 'Marriott', 'Stockholm Marriott Hotel', 200.00, 'SEK', NULL);

-- Seoul, South Korea
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('cc903446-ffd3-4379-90ee-08f0764fd118', 'Shilla', 'The Shilla Seoul', 350.00, 'KRW', NULL),
('cc903446-ffd3-4379-90ee-08f0764fd118', 'Four Seasons', 'Four Seasons Hotel Seoul', 400.00, 'KRW', NULL),
('cc903446-ffd3-4379-90ee-08f0764fd118', 'Marriott', 'Seoul Marriott Hotel', 250.00, 'KRW', NULL);

-- Melbourne, Australia
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('cdc99c95-20e5-402a-ae4b-557d9b06427a', 'Crown', 'Crown Towers Melbourne', 350.00, 'AUD', NULL),
('cdc99c95-20e5-402a-ae4b-557d9b06427a', 'Park Hyatt', 'Park Hyatt Melbourne', 400.00, 'AUD', NULL),
('cdc99c95-20e5-402a-ae4b-557d9b06427a', 'Marriott', 'Melbourne Marriott Hotel', 250.00, 'AUD', NULL);

-- Paris, France
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('d6d4121e-ca7f-498d-b58c-82d118c67b08', 'Ritz', 'Hotel Ritz Paris', 800.00, 'EUR', NULL),
('d6d4121e-ca7f-498d-b58c-82d118c67b08', 'Four Seasons', 'Four Seasons Hotel George V', 600.00, 'EUR', NULL),
('d6d4121e-ca7f-498d-b58c-82d118c67b08', 'Marriott', 'Paris Marriott Champs Elysees', 300.00, 'EUR', NULL);

-- Auckland, New Zealand
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('e098587d-f1a8-4cf7-b68e-a7b5f2855d11', 'Sofitel', 'Sofitel Auckland Viaduct Harbour', 250.00, 'NZD', NULL),
('e098587d-f1a8-4cf7-b68e-a7b5f2855d11', 'Hilton', 'Hilton Auckland', 200.00, 'NZD', NULL),
('e098587d-f1a8-4cf7-b68e-a7b5f2855d11', 'Local', 'Cordis Auckland', 180.00, 'NZD', NULL);

-- Cape Town, South Africa
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('e30871b9-4127-4ab4-aa2a-424532d7e34b', 'One&Only', 'One&Only Cape Town', 350.00, 'ZAR', NULL),
('e30871b9-4127-4ab4-aa2a-424532d7e34b', 'Mount Nelson', 'Belmond Mount Nelson Hotel', 300.00, 'ZAR', NULL),
('e30871b9-4127-4ab4-aa2a-424532d7e34b', 'Marriott', 'Cape Town Marriott Hotel', 200.00, 'ZAR', NULL);

-- New York, United States
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('ebee26de-275d-47a8-8ce0-cd63f0878e72', 'Plaza', 'The Plaza New York', 600.00, 'USD', NULL),
('ebee26de-275d-47a8-8ce0-cd63f0878e72', 'Waldorf Astoria', 'Waldorf Astoria New York', 500.00, 'USD', NULL),
('ebee26de-275d-47a8-8ce0-cd63f0878e72', 'Marriott', 'New York Marriott Marquis', 350.00, 'USD', NULL);

-- Lima, Peru
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('f34352ad-2cfd-418a-b71d-cbca15fbdbf2', 'Belmond', 'Belmond Hotel B', 250.00, 'PEN', NULL),
('f34352ad-2cfd-418a-b71d-cbca15fbdbf2', 'Marriott', 'Lima Marriott Hotel', 180.00, 'PEN', NULL),
('f34352ad-2cfd-418a-b71d-cbca15fbdbf2', 'Local', 'Hotel B Arts Boutique', 150.00, 'PEN', NULL);

-- Hong Kong, China
INSERT INTO public.accommodations (city_id, provider, name, price_per_night, currency, currency_id) VALUES
('fb0c3451-ef1b-4ac5-b7ed-19c07b101083', 'Peninsula', 'The Peninsula Hong Kong', 800.00, 'HKD', NULL),
('fb0c3451-ef1b-4ac5-b7ed-19c07b101083', 'Four Seasons', 'Four Seasons Hotel Hong Kong', 600.00, 'HKD', NULL),
('fb0c3451-ef1b-4ac5-b7ed-19c07b101083', 'Marriott', 'Hong Kong Marriott Hotel', 350.00, 'HKD', NULL);

-- Note: currency_id is set to NULL as per your schema
-- You can update these with actual currency UUIDs if you have a currencies table
