-- ═══════════════════════════════════════════════════════════════════════
-- IKO DAWA WELLNESS — Supabase Schema
-- Run this entire file in the Supabase SQL Editor (one-shot)
-- ═══════════════════════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────────────────────────
-- 1. PRODUCTS
-- ─────────────────────────────────────────────────────────────────────
create table if not exists products (
  id          bigserial primary key,
  title       text        not null,
  brand       text        not null default 'Natural Factors',
  price       numeric     not null default 0,
  image       text        not null default '',
  description text        not null default '',
  composition text        not null default '',
  in_stock    boolean     not null default true,
  category    text,
  created_at  timestamptz not null default now()
);

-- Seed sample products
insert into products (title, brand, price, image, description, composition, in_stock) values
  ('Zinc Citrate 50mg',  'Natural Factors', 1250, 'https://picsum.photos/seed/zinc/400/400',     'Zinc Citrate is a more absorbable form of zinc that helps support immune function and maintain healthy skin.', 'Zinc (Citrate) 50mg', true),
  ('Vitamin C 1000mg',  'Natural Factors', 1800, 'https://picsum.photos/seed/vitaminc/400/400', 'Time-release Vitamin C with Bioflavonoids for superior absorption and immune support.', 'Vitamin C 1000mg, Rosehips', true)
on conflict do nothing;

-- ─────────────────────────────────────────────────────────────────────
-- 2. HERO BANNERS
-- ─────────────────────────────────────────────────────────────────────
create table if not exists hero_banners (
  id          bigserial primary key,
  image       text        not null default '',
  link        text        not null default '',
  title       text,
  subtitle    text,
  order_index int         not null default 0,
  active      boolean     not null default true,
  created_at  timestamptz not null default now()
);

-- Seed one banner
insert into hero_banners (image, link, order_index) values
  ('https://picsum.photos/seed/wellness/1920/600', '#shop-section', 0)
on conflict do nothing;

-- ─────────────────────────────────────────────────────────────────────
-- 3. ORDERS & ORDER ITEMS
-- ─────────────────────────────────────────────────────────────────────
create table if not exists orders (
  id              uuid        primary key default uuid_generate_v4(),
  customer_name   text        not null,
  customer_email  text        not null,
  total_amount    numeric     not null default 0,
  status          text        not null default 'pending' check (status in ('pending','dispatched','completed')),
  created_at      timestamptz not null default now()
);

create table if not exists order_items (
  id              bigserial   primary key,
  order_id        uuid        not null references orders(id) on delete cascade,
  product_id      bigint      not null references products(id),
  quantity        int         not null default 1,
  price_at_sale   numeric     not null,
  created_at      timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────
-- 4. CONTACT MESSAGES
-- ─────────────────────────────────────────────────────────────────────
create table if not exists contact_messages (
  id          uuid        primary key default uuid_generate_v4(),
  first_name  text        not null,
  last_name   text        not null,
  email       text        not null,
  subject     text        not null,
  message     text        not null,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────
-- 5. SITE CONTENT (key-value store for all editable text)
-- ─────────────────────────────────────────────────────────────────────
create table if not exists site_content (
  id          bigserial   primary key,
  key         text        not null unique,
  value       text        not null default '',
  updated_at  timestamptz not null default now()
);

-- Seed default content
insert into site_content (key, value) values
  ('site_tagline',            'Precision Health'),
  ('footer_tagline',          'Premium dietary supplements formulated for maximum efficacy and daily wellness.'),
  ('footer_email',            'info@ikodawa.com'),
  ('footer_phone',            '+254 714 279143'),
  ('footer_copyright',        '© 2026 IKO DAWA. All rights reserved.'),
  ('shop_eyebrow',            'Precision Selection'),
  ('shop_heading',            'Essentials for Daily Life'),
  ('mission_heading_plain',   'IKO'),
  ('mission_heading_italic',  'DAWA'),
  ('mission_body_1',          'At IKO DAWA Wellness Centre, the divide between nature and clinical efficacy doesn''t exist. We operate at the intersection of biological wisdom and laboratory precision.'),
  ('mission_body_2',          'Founded by clinical researchers who grew tired of industry opaque blends, we built a sanctuary for purity. We remove the excess, keep the essence, and ensure every grain serves your health.'),
  ('mission_btn_philosophy',  'Our Philosophy'),
  ('mission_btn_contact',     'Contact Us'),
  ('mission_btn_trials',      'View Trials'),
  ('about_eyebrow',           'Our Heritage'),
  ('about_heading',           'Built on Truth'),
  ('about_intro',             'IKO DAWA Wellness Centre was founded to bridge the gap between ancient biological wisdom and modern pharmaceutical precision.'),
  ('about_image_url',         'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop'),
  ('about_story_heading',     'A radical commitment to purity'),
  ('about_beginning_title',   'The Beginning'),
  ('about_beginning_text',    'What began as a small research initiative is now a global search for the most potent, bio-active ingredients on earth. We don''t just source; we verify.'),
  ('about_standards_title',   'The Standards'),
  ('about_standards_text',    'By partnering with elite clinical labs and regenerative farms, we''ve created a supply chain that is as transparent as it is effective.'),
  ('about_cta_title',         'Join the Movement'),
  ('about_cta_subtitle',      'Stay updated on our latest clinical trials.'),
  ('about_cta_btn',           'Subscribe'),
  ('value1_title',            'Ethically Yielded'),
  ('value1_text',             'Our botanicals are harvested at peak potency using methods that regenerate the soil rather than deplete it.'),
  ('value2_title',            'Unrivaled Safety'),
  ('value2_text',             'We conduct rigorous third-party screening for contaminants, ensuring every dose is as pure as nature intended.'),
  ('value3_title',            'Active Design'),
  ('value3_text',             'Formulated with molecular precision to ensure maximum bioavailability and targeted nutrient release.'),
  ('contact_heading',         'Let''s Begin'),
  ('contact_subtext',         'Whether you''re seeking guidance on protocol or tracking an order, our specialists are standing by.'),
  ('contact_email',           'info@ikodawa.com'),
  ('contact_phone',           '+254 714 279143'),
  ('contact_email_label',     'Direct Inquiries'),
  ('contact_phone_label',     'Call Us'),
  ('science_eyebrow',         'Precision Research'),
  ('science_heading',         'Rigorous Proofs'),
  ('science_intro',           'Every IKO DAWA formulation begins in the lab, validated by third-party clinical data and molecular bioavailability screening.'),
  ('science_image_url',       'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop'),
  ('science_story_heading',   'Documented Bioavailability'),
  ('science_story_body',      'We believe in transparency. We use clinical dosages proven in human trials, ensuring nutrient delivery is targeted and measurable.'),
  ('science_card1_title',     'cGMP Verified'),
  ('science_card1_text',      'Manufactured in elite facilities under stringent environmental controls.'),
  ('science_card2_title',     'Zero Contaminants'),
  ('science_card2_text',      'Systematic screening for heavy metals, pesticides, and residual solvents.'),
  ('privacy_intro',           'Trust Framework'),
  ('privacy_revised',         'Revised: April 2026'),
  ('privacy_section1_title',  '01. Data Governance'),
  ('privacy_section1_text',   'We prioritize the security of your biological and transactional data. Information collected during checkout is for the sole intention of order fulfillment and clinical updates.'),
  ('privacy_section2_title',  '02. Ethical Use'),
  ('privacy_section2_text',   'We do not engage in the monetization of customer browsing habits or purchase histories. Your data is your property.'),
  ('privacy_section3_title',  '03. Security Integrity'),
  ('privacy_section3_text',   'Utilizing PCI-compliant encryption pipelines and cold-storage strategies, we ensure your personal identifier information remains isolated from public vectors.')
on conflict (key) do nothing;

-- ─────────────────────────────────────────────────────────────────────
-- 6. INVENTORY BATCHES
-- ─────────────────────────────────────────────────────────────────────
create table if not exists inventory_batches (
  id           uuid        primary key default uuid_generate_v4(),
  batch_number text        not null,
  product_id   bigint      not null references products(id),
  expiry_date  date        not null,
  quantity     int         not null default 0,
  status       text        not null default 'good' check (status in ('good','expiring','expired')),
  created_at   timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────
-- 7. ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────────────

-- Products: public read
alter table products enable row level security;
create policy "products_public_read"  on products for select using (true);
create policy "products_admin_all"    on products for all    using (auth.role() = 'authenticated');

-- Hero banners: public read
alter table hero_banners enable row level security;
create policy "banners_public_read"   on hero_banners for select using (true);
create policy "banners_admin_all"     on hero_banners for all    using (auth.role() = 'authenticated');

-- Contact messages: anyone can insert, only authenticated can read
alter table contact_messages enable row level security;
create policy "contact_public_insert" on contact_messages for insert with check (true);
create policy "contact_admin_read"    on contact_messages for select using (auth.role() = 'authenticated');

-- Orders: public insert (checkout), only authenticated can read/update
alter table orders enable row level security;
create policy "orders_public_insert"  on orders for insert with check (true);
create policy "orders_admin_all"      on orders for all    using (auth.role() = 'authenticated');

alter table order_items enable row level security;
create policy "items_public_insert"   on order_items for insert with check (true);
create policy "items_admin_all"       on order_items for all    using (auth.role() = 'authenticated');

-- Site content: public read, authenticated write
alter table site_content enable row level security;
create policy "content_public_read"   on site_content for select using (true);
create policy "content_admin_all"     on site_content for all    using (auth.role() = 'authenticated');

-- Inventory: authenticated only
alter table inventory_batches enable row level security;
create policy "inventory_admin_all"   on inventory_batches for all using (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────
-- 8. STORAGE BUCKET FOR PRODUCT IMAGES
-- ─────────────────────────────────────────────────────────────────────
-- Run manually in Supabase Dashboard > Storage > New Bucket:
--   Name: product-images
--   Public: true
-- Or uncomment the lines below if your Supabase version supports it:
-- insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict do nothing;
