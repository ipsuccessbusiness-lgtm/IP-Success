-- ============================================
-- IP Success - Complete Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  name_hi TEXT,
  name_gu TEXT,
  price INTEGER NOT NULL, -- in paise (1 INR = 100 paise)
  original_price INTEGER,
  description TEXT,
  description_hi TEXT,
  description_gu TEXT,
  items_included JSONB DEFAULT '[]',
  benefits JSONB DEFAULT '[]',
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INVENTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS inventory (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 10,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address JSONB NOT NULL,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('razorpay', 'cod')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  order_status TEXT NOT NULL DEFAULT 'new' CHECK (order_status IN ('new', 'confirmed', 'dispatched', 'delivered', 'cancelled')),
  tracking_id TEXT,
  courier_name TEXT,
  language TEXT DEFAULT 'en',
  notes TEXT,
  source TEXT DEFAULT 'website' CHECK (source IN ('website', 'phone', 'whatsapp')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TESTIMONIALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  review TEXT NOT NULL,
  review_hi TEXT,
  review_gu TEXT,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  avatar_initials TEXT NOT NULL DEFAULT 'UN',
  image_url TEXT,
  video_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SITE CONTENT TABLE (CMS)
-- ============================================
CREATE TABLE IF NOT EXISTS site_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value_en TEXT NOT NULL,
  value_hi TEXT,
  value_gu TEXT,
  value_hinglish TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Products: public read, admin write
CREATE POLICY "products_public_read" ON products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "products_admin_all" ON products FOR ALL USING (auth.role() = 'authenticated');

-- Inventory: admin only
CREATE POLICY "inventory_admin_all" ON inventory FOR ALL USING (auth.role() = 'authenticated');

-- Orders: admin full access, public insert (for new orders)
CREATE POLICY "orders_public_insert" ON orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "orders_admin_all" ON orders FOR ALL USING (auth.role() = 'authenticated');

-- Testimonials: public read active, admin full
CREATE POLICY "testimonials_public_read" ON testimonials FOR SELECT USING (is_active = TRUE);
CREATE POLICY "testimonials_admin_all" ON testimonials FOR ALL USING (auth.role() = 'authenticated');

-- Site content: public read, admin write
CREATE POLICY "content_public_read" ON site_content FOR SELECT USING (TRUE);
CREATE POLICY "content_admin_write" ON site_content FOR ALL USING (auth.role() = 'authenticated');

-- Settings: admin only
CREATE POLICY "settings_admin_all" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- SEED DATA
-- ============================================

-- Insert products
INSERT INTO products (name, name_hi, name_gu, price, original_price, description, items_included, benefits, is_popular, is_active) VALUES
(
  'Starter Pack',
  'स्टार्टर पैक',
  'સ્ટાર્ટર પૅક',
  247500,
  NULL,
  'For Initial Stage Piles Relief',
  '["1x Pilescare Syrup (500ml)", "1x DOUBLE-STEM Cell Powder (100g)"]',
  '["Reduces acute swelling and itching", "Clears digestive toxins", "Softens stool for easier motion"]',
  FALSE,
  TRUE
),
(
  'Best Value Pack',
  'बेस्ट वैल्यू पैक',
  'બેસ્ટ વૅલ્યૂ પૅક',
  372500,
  495000,
  'For Chronic Cases & Bleeding Piles',
  '["2x Pilescare Syrup (500ml)", "1x DOUBLE-STEM Cell Powder (100g)"]',
  '["Halts persistent bleeding (in 3-5 days)", "Repairs internal intestinal lining", "Prevents recurrence and relapses", "30-Day complete gut transformation"]',
  TRUE,
  TRUE
)
ON CONFLICT DO NOTHING;

-- Insert inventory (linked to products)
INSERT INTO inventory (product_id, quantity, low_stock_threshold)
SELECT id, 100, 10 FROM products WHERE name = 'Starter Pack'
ON CONFLICT DO NOTHING;

INSERT INTO inventory (product_id, quantity, low_stock_threshold)
SELECT id, 100, 10 FROM products WHERE name = 'Best Value Pack'
ON CONFLICT DO NOTHING;

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('whatsapp_number', '919925050013'),
  ('cod_enabled', 'true'),
  ('razorpay_enabled', 'true'),
  ('low_stock_alert_email', 'admin@ipsuccess.in'),
  ('store_name', 'IP Success'),
  ('store_phone', '+91 99250 50013'),
  ('store_address', 'Ahmedabad, Gujarat – 380001')
ON CONFLICT (key) DO NOTHING;

-- Insert default testimonials
INSERT INTO testimonials (name, location, review, rating, avatar_initials, is_active, sort_order) VALUES
  ('Rajesh Kumar', 'Ahmedabad, Gujarat', 'Maine 5 saal se piles ki dikkat jheli hai. Best Value Pack lene ke 10 din baad hi bleeding band ho gayi. Thank you IP Success!', 5, 'RK', TRUE, 1),
  ('Amit Sharma', 'Indore, MP', 'Operation ka darr tha, par wife ne ye recommend kiya. Initial relief was fast. 1 month baad ab bilkul theek hoon.', 5, 'AS', TRUE, 2),
  ('Vijay M.', 'Surat, Gujarat', 'Effective medicine with no side effects. The powder is very strong for reducing swelling. Highly recommended for chronic piles.', 5, 'VM', TRUE, 3)
ON CONFLICT DO NOTHING;

-- Insert default site content
INSERT INTO site_content (key, value_en, value_hi, value_gu, value_hinglish) VALUES
  ('hero_headline', 'Get Lasting Relief From Piles in 14 Days Without Surgery.', 'बिना ऑपरेशन के 14 दिनों में बवासीर से स्थायी राहत पाएं।', 'ઑપરેશન વિના 14 દિવસમાં હરસ-મસામાંથી કાયમી રાહત મેળવો.', 'Bina Operation ke 14 Din mein Bawaseer se Puri Rahat Paiye.'),
  ('hero_subheadline', 'Ancient herbal wisdom meets modern extraction techniques to target the root cause of your pain.', 'प्राचीन जड़ी-बूटियों की शक्ति और आधुनिक तकनीक से दर्द की जड़ को खत्म करें।', 'પ્રાચીન જડીબૂટીઓની શક્તિ અને આધુનિક ટેક્નોલૉજી વડે દર્દના મૂળ કારણને ખતમ કરો.', 'Purani jadibootiyon ki taqat aur modern science se dard ki jad ko khatam karo.'),
  ('pain_headline', '"Doctor says surgery is the only way..."', '"डॉक्टर बोलता है ऑपरेशन ही एक रास्ता है..."', '"ડૉક્ટર કહે છે ઑપરેશન જ એક રસ્તો છે..."', '"Doctor bolta hai surgery hi ek rasta hai..."'),
  ('offers_title', 'Select Your Healing Combo', 'अपना हीलिंग कॉम्बो चुनें', 'તમારો હીલિંગ કૉમ્બો પસંદ કરો', 'Apna Healing Combo Chuno'),
  ('footer_tagline', 'Ayurvedic Healthcare solutions bridging ancient wisdom with modern clinical efficacy.', 'प्राचीन ज्ञान को आधुनिक नैदानिक प्रभावकारिता के साथ जोड़ने वाली आयुर्वेदिक स्वास्थ्य सेवाएं।', 'પ્રાચીન જ્ઞાન અને આધુનિક ક્લિનિકલ અસરકારકતા સાથે આયુર્વેદિક આરોગ્ય સેવાઓ.', 'Purani Ayurvedic wisdom ko modern clinical efficacy ke saath jodne wali healthcare.'),
  ('logo_image', '', '', '', ''),
  ('hero_image', '', '', '', '')
ON CONFLICT (key) DO NOTHING;
