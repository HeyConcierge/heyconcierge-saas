-- HeyConcierge for Cruise — Seed Data
-- Run after 011_cruise_mvp.sql migration

-- Norwegian Travel Company as operator
INSERT INTO cruise_operators (id, name, slug, contact_email, country, description) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Norwegian Travel Company', 'ntc', 'jacob@norwegian.travel', 'NO',
   'Norwegian Travel Company (NTC) is the leading destination management company in Åndalsnes and the Romsdal region, operating iconic attractions including Romsdalsgondola and the Golden Train.');

-- Products: Romsdalsgondola + Golden Train
INSERT INTO cruise_products (id, operator_id, name, description, location_port, product_type, price_adult_eur, price_child_eur, duration_minutes, capacity_per_slot, images, highlights, includes, meeting_point, available_months) VALUES
  ('b1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000001',
   'Romsdalsgondola — Panoramic Gondola Ride',
   'Soar 708 meters above Åndalsnes in Norway''s most spectacular gondola. At the summit, enjoy breathtaking 360° views of the Romsdal Alps, Rauma river valley, and Isfjorden. The mountaintop features a viewing platform, café, and hiking trails.',
   'Åndalsnes', 'attraction', 45.00, 25.00, 120, 40,
   '["https://heyconcierge.com/images/romsdalsgondola.webp"]'::jsonb,
   '["708m elevation", "360° panoramic views", "Summit café", "Hiking trails at top", "Wheelchair accessible"]'::jsonb,
   '["Return gondola ticket", "Access to summit viewpoint", "Trail map"]'::jsonb,
   'Romsdalsgondola base station, Nesaksla, Åndalsnes (10 min walk from cruise terminal)',
   ARRAY[4,5,6,7,8,9,10]),

  ('b1000000-0000-0000-0000-000000000002',
   'a1000000-0000-0000-0000-000000000001',
   'Golden Train — Raumabanen Scenic Rail Journey',
   'Experience one of Europe''s most beautiful train journeys on the historic Rauma Line. The Golden Train takes you through dramatic mountain scenery, past the famous Trollveggen (Troll Wall), over the iconic Kylling Bridge, and into the heart of Norwegian fjord country.',
   'Åndalsnes', 'transport', 35.00, 18.00, 90, 80,
   '["https://heyconcierge.com/images/golden-train.webp"]'::jsonb,
   '["Historic Rauma Line", "Trollveggen viewpoint", "Kylling Bridge crossing", "Onboard commentary", "Return journey included"]'::jsonb,
   '["Return train ticket", "Onboard audio guide", "Complimentary coffee"]'::jsonb,
   'Åndalsnes train station (5 min walk from cruise terminal)',
   ARRAY[5,6,7,8,9]);

-- AIDA as cruise line (22.5% commission)
INSERT INTO cruise_lines (id, name, slug, commission_rate, contact_email) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'AIDA Cruises', 'aida', 22.50, 'shorex@aida.de');

-- AIDAprima ship
INSERT INTO cruise_ships (id, cruise_line_id, name, capacity_pax, imo_number) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'AIDAprima', 3300, '9636955');

-- 3 sample port calls in Åndalsnes (April-May 2026)
INSERT INTO cruise_port_calls (id, ship_id, port_name, arrival_date, arrival_time, departure_time, estimated_pax) VALUES
  ('e1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'Åndalsnes', '2026-04-18', '07:00', '17:00', 2800),
  ('e1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', 'Åndalsnes', '2026-05-02', '08:00', '18:00', 3100),
  ('e1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001', 'Åndalsnes', '2026-05-16', '07:30', '16:30', 2900);
