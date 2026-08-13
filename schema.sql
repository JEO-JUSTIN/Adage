-- SQL Script to set up ADAGE'26 Supabase Backend database
-- Copy and paste this script directly into your Supabase project SQL Editor (under "SQL Editor" -> "New query" -> "Run").

-- 1. Enable UUID Extension (optional but recommended)
create extension if not exists "uuid-ossp";

-- 2. Drop existing tables if they exist to prevent conflicts
drop table if exists registrations;
drop table if exists events;

-- 3. Create Events Table
create table events (
  id text primary key,
  title text not null,
  "whatsappLink" text,
  description text,
  slogan text,
  category text not null,
  "maxMembers" integer,
  fee integer not null default 0,
  prize text,
  timing text,
  image text,
  rounds jsonb default '[]'::jsonb,
  rules jsonb default '[]'::jsonb,
  coordinators jsonb default '[]'::jsonb
);

-- 4. Create Registrations Table
create table registrations (
  id text primary key,
  name text not null,
  college text not null,
  department text not null,
  email text not null,
  phone text not null,
  "teamMembers" jsonb default '[]'::jsonb,
  events jsonb default '[]'::jsonb,
  "totalFee" integer default 0,
  "transactionId" text unique,
  "screenshotUrl" text,
  status text not null default 'Payment Pending Verification',
  timestamp timestamptz default now()
);

-- 5. Seed Events table with the default Civil Engineering events (All 10 Events)
insert into events (id, title, "whatsappLink", description, slogan, category, "maxMembers", fee, prize, timing, image, rounds, rules, coordinators) values
(
  'cad-craft',
  'CAD CRAFT',
  'https://chat.whatsapp.com/HoiclgPoIm6E66eAsU9CJk',
  'A fast-paced AutoCAD design challenge. Draw, annotate, and deliver architectural plans under strict time limits.',
  'Precision in every dimension',
  'Technical',
  2,
  250,
  'Certificate + Cash Prize',
  '10:30 AM',
  'https://images.unsplash.com/photo-1503387762-592dedb8c260?auto=format&fit=crop&q=80&w=800',
  '[{"name": "ROUND 1: THE BLUEPRINT SPRINT", "details": "Format: Screen-based AutoCAD drafting. Structure: Recreate a 2D floor plan from a given printed layout within 30 minutes. Focus: Accuracy, layers, dimensioning, and speed."}, {"name": "ROUND 2: THE 3D DEEP-DIVE", "details": "Format: Advanced 3D modeling challenge. Structure: Extrude and model a 3D elevation from the 2D layout. Time: 45 minutes."}]'::jsonb,
  '["Use of shortcuts and custom commands is permitted.", "Laptops with AutoCAD installed must be brought, or computer labs will be allocated.", "Plagiarism or copying pre-existing blocks is strictly prohibited.", "Any form of malpractice leads to immediate disqualification.", "The judges'' decisions are final and binding."]'::jsonb,
  '[{"name": "SUNDHARAMOORTHI K", "phone": "8248121866"}]'::jsonb
),
(
  'spruce-span',
  'SPRUCE SPAN',
  'https://chat.whatsapp.com/IOl3b8G0o09LS6enAhgSOj',
  'The ultimate bridge-building competition. Build structural bridge models and test their load-carrying capacity to destruction.',
  'Strength in shapes, beauty in spans',
  'Technical',
  3,
  250,
  'Certificate + Cash Prize',
  '11:00 AM',
  'https://images.unsplash.com/photo-1447087640989-1065792fb138?auto=format&fit=crop&q=80&w=800',
  '[{"name": "ROUND 1: TRUSS DRAFTING", "details": "Design and present a load distribution scheme on paper. Explain truss mechanics, nodes, and expected load paths."}, {"name": "ROUND 2: LOAD SHIELD TESTING", "details": "Construct the bridge using the provided materials (sticks/glue) and submit it for point-load testing on a hydraulic rig until failure. Highest load-to-weight ratio wins."}]'::jsonb,
  '["Materials for construction will be provided at the venue.", "Bridge dimensions must strictly satisfy standard constraints (Length: 40cm, Width: 10cm).", "Only approved adhesives can be used.", "Coordinator''s decision is final."]'::jsonb,
  '[{"name": "Barath Kumar M", "phone": "6380616416"}]'::jsonb
),
(
  'concrete-master',
  'CONCRETE MASTER',
  'https://chat.whatsapp.com/DzQ8iWwPgQ2BswxL9NFnV0',
  'A materials science testing event focusing on concrete mix design, water-cement ratios, compressive strength calculations, and innovative green materials.',
  'Mix, cure, compress',
  'Technical',
  2,
  250,
  'Certificate + Cash Prize',
  '02:00 PM',
  'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=800',
  '[{"name": "ROUND 1: MIX RATIO DESIGN", "details": "Calculate the exact batch weights of cement, aggregates, and water for a specified characteristic strength (e.g. M30)."}, {"name": "ROUND 2: CURE & COMPRESS", "details": "Explain curing techniques, admixture effects, and participate in a virtual compression testing quiz."}]'::jsonb,
  '["Use of standard IS codebooks (IS 10262) is allowed (copies will be provided).", "Calculators are mandatory.", "Cheating leads to disqualification.", "Coordinator''s decision is final."]'::jsonb,
  '[{"name": "GOKUL RAJ M", "phone": "9025280584"}]'::jsonb
),
(
  'survey-elite',
  'SURVEY ELITE',
  'https://chat.whatsapp.com/J76CCGv8YuJ56ZjXmSyl0E',
  'Demonstrate precision in surveying. Set up instruments, perform leveling, and compute contours in a live field environment.',
  'Measure twice, dig once',
  'Technical',
  3,
  250,
  'Certificate + Cash Prize',
  '10:00 AM',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800',
  '[{"name": "ROUND 1: QUICK LEVELING", "details": "Set up the auto level or theodolite instrument over a peg and perform initial adjustments. Speed and centering accuracy are evaluated."}, {"name": "ROUND 2: PROFILE PROFILE MAP", "details": "Take staff readings across a grid, calculate reduced levels (RL) using height of instrument method, and plot a quick profile map."}]'::jsonb,
  '["Instrument handling should be done with utmost care.", "Calculations must be presented clearly on field sheets.", "Winner determined by minimum error in closed traverse/loop closure."]'::jsonb,
  '[{"name": "Saravana bala S", "phone": "9080046138"}]'::jsonb
),
(
  'paper-xpose',
  'PAPERXPOSE',
  'https://chat.whatsapp.com/FiPNsYv95y4GMWzAlnh51e',
  'A research platform to present innovative developments in smart structures, green building materials, transportation engineering, and environmental management.',
  'Drafting concepts. Engineering futures.',
  'Technical',
  4,
  250,
  'Certificate + Cash Prize',
  '10:00 AM',
  'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800',
  '[]'::jsonb,
  '["Team size: Maximum 3 or 4 members.", "Abstract should be submitted in PDF and PPT format (6-7 slides) before August 23 on adage26@gmail.com.", "Topics must relate to Civil Engineering, smart materials, or environmental sustainability.", "Presentation must be 7-10 minutes followed by Q&A.", "College ID card is mandatory.", "The decision of the judges is final."]'::jsonb,
  '[{"name": "PALANI R", "phone": "8682938618"}]'::jsonb
),
(
  'geo-analyze',
  'GEO-ANALYZE',
  'https://chat.whatsapp.com/DjHbLLT6NurKvf9Lav76CV',
  'Analyze soil characteristics, soil profiles, foundation settlement challenges, and design retainment solutions for unstable slopes.',
  'Understanding the ground beneath',
  'Technical',
  2,
  250,
  'Certificate + Cash Prize',
  '10:00 AM',
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800',
  '[]'::jsonb,
  '["Calculators are permitted.", "Concepts will cover soil compaction, shear strength, and retaining wall stability.", "Presentations will be on design layouts for foundation pegs.", "Evaluated based on structural feasibility and calculation correctness."]'::jsonb,
  '[{"name": "Akash S", "phone": "9677132896"}]'::jsonb
),
(
  'urbanscapes',
  'URBANSCAPES',
  'https://chat.whatsapp.com/BvciWK0VlU20V0FxqWBJtj',
  'Design and pitch a green, self-sustaining city layout. Balance residential zone spacing, transport systems, waste disposal, and parks.',
  'Planning cities for a better tomorrow',
  'Non-Technical',
  4,
  150,
  'Certificate + Cash Prize',
  '02:00 PM',
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=800',
  '[]'::jsonb,
  '["Team size: 2 to 4 members.", "Create and present drawing charts at the venue. Basic drawing tools (sheets) will be provided.", "Incorporate green energy nodes, rainwater harvesting systems, and metro links.", "Presentation pitch is limited to 5 minutes."]'::jsonb,
  '[{"name": "Midhun.R", "phone": "9787671962"}]'::jsonb
),
(
  'shutter-span',
  'SHUTTER SPAN',
  'https://chat.whatsapp.com/C29zQ3jszmI77CQ7kt3Eqq',
  'Infrastructure photography competition. Capture the aesthetic geometry of bridges, historical structures, and concrete architecture around you.',
  'Lenses focusing on concrete giants',
  'Non-Technical',
  1,
  150,
  'Certificate + Cash Prize',
  '11:30 AM',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
  '[]'::jsonb,
  '["Individual event.", "Photos must be captured inside the campus or submitted online if requested.", "No heavy digital manipulation is allowed.", "Submit image file in EXIF readable format."]'::jsonb,
  '[{"name": "Saru Nithish R", "phone": "7339250785"}]'::jsonb
),
(
  'mystery-block',
  'MYSTERY BLOCK',
  'https://chat.whatsapp.com/Lgby2njOCKB7bi5n8vSY4D',
  'A fun-filled non-technical puzzle event. Open mystery boxes containing Jenga challenges, bricks stacking, and structural puzzle elements.',
  'Face the block and balance the load',
  'Non-Technical',
  2,
  150,
  'Certificate + Cash Prize',
  '01:30 PM',
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800',
  '[]'::jsonb,
  '["Team of 2 members.", "Tasks must be finished in the allocated countdown period.", "Balance and tower stability are checked. Overturning results in point deduction.", "Have fun and stack smart!"]'::jsonb,
  '[{"name": "Bharath PS", "phone": "9095343275"}]'::jsonb
),
(
  'cad-prompt',
  'CAD PROMPT',
  'https://chat.whatsapp.com/Ed4DsYtmiKfCbzSVyDKMHd',
  'Formulate strategic instructions for structural design AI tools. Prompt AI image generators to create specific building designs.',
  'Instructing intelligence to construct designs',
  'Non-Technical',
  2,
  150,
  'Certificate + Cash Prize',
  '10:30 AM',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
  '[]'::jsonb,
  '["Prompts must target specific structural criteria.", "Evaluated by how close the AI output matches the source requirements.", "No external search tools allowed during the contest."]'::jsonb,
  '[{"name": "Sriram P", "phone": "8778743292"}]'::jsonb
);

-- 6. Enable Public Read/Write Access (No Auth restrictions for registration submission)
alter table registrations enable row level security;
alter table events enable row level security;

create policy "Allow public read access to events" on events for select using (true);
create policy "Allow public update access to events" on events for update using (true);
create policy "Allow public write access to events" on events for insert with check (true);
create policy "Allow public delete access to events" on events for delete using (true);
create policy "Allow public read access to registrations" on registrations for select using (true);
create policy "Allow public write access to registrations" on registrations for insert with check (true);
create policy "Allow public update access to registrations" on registrations for update using (true);
create policy "Allow public delete access to registrations" on registrations for delete using (true);

-- 7. Migration Helper Queries: Run these in your Supabase SQL Editor if your registrations table was created earlier:
alter table registrations add constraint registrations_transactionid_unique unique ("transactionId");
alter table registrations add column if not exists "screenshotUrl" text;

