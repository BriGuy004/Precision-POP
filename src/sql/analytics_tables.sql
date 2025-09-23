-- Supabase table schemas for Precision POP analytics

-- Swipe analytics table
CREATE TABLE swipe_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  coupon_id VARCHAR(255) NOT NULL,
  brand_id VARCHAR(255),
  campaign_id VARCHAR(255),
  swipe_direction VARCHAR(10) NOT NULL CHECK (swipe_direction IN ('left', 'right')),
  swipe_method VARCHAR(10) NOT NULL CHECK (swipe_method IN ('gesture', 'button')),
  view_start_time BIGINT NOT NULL,
  view_duration INTEGER NOT NULL,
  drag_distance FLOAT DEFAULT 0,
  swipe_velocity FLOAT DEFAULT 0,
  hesitation_events INTEGER DEFAULT 0,
  is_personalized BOOLEAN DEFAULT FALSE,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  conversion_probability FLOAT,
  category VARCHAR(100),
  coupon_value DECIMAL(10,2),
  device_type VARCHAR(20) NOT NULL CHECK (device_type IN ('mobile', 'desktop')),
  store_id VARCHAR(255),
  is_checked_in BOOLEAN DEFAULT FALSE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  session_id VARCHAR(255) NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- View analytics table
CREATE TABLE view_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  coupon_id VARCHAR(255) NOT NULL,
  brand_id VARCHAR(255),
  view_context VARCHAR(20) NOT NULL CHECK (view_context IN ('swipe', 'browse', 'search', 'category')),
  view_start_time BIGINT NOT NULL,
  view_duration INTEGER NOT NULL,
  search_query VARCHAR(255),
  category_filter VARCHAR(100),
  is_personalized BOOLEAN DEFAULT FALSE,
  position INTEGER DEFAULT 0,
  session_id VARCHAR(255) NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session analytics table
CREATE TABLE session_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  session_id VARCHAR(255) NOT NULL,
  start_time BIGINT NOT NULL,
  end_time BIGINT,
  total_coupons_viewed INTEGER DEFAULT 0,
  total_coupons_accepted INTEGER DEFAULT 0,
  total_coupons_declined INTEGER DEFAULT 0,
  average_view_duration FLOAT DEFAULT 0,
  device_type VARCHAR(20) NOT NULL CHECK (device_type IN ('mobile', 'desktop')),
  store_id VARCHAR(255),
  checked_in_duration INTEGER DEFAULT 0,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Redemption tracking table
CREATE TABLE redemption_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  coupon_id VARCHAR(255) NOT NULL,
  brand_id VARCHAR(255),
  campaign_id VARCHAR(255),
  redemption_value DECIMAL(10,2) NOT NULL,
  store_id VARCHAR(255),
  session_id VARCHAR(255) NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_swipe_analytics_user_id ON swipe_analytics(user_id);
CREATE INDEX idx_swipe_analytics_brand_id ON swipe_analytics(brand_id);
CREATE INDEX idx_swipe_analytics_timestamp ON swipe_analytics(timestamp);
CREATE INDEX idx_swipe_analytics_campaign_id ON swipe_analytics(campaign_id);

CREATE INDEX idx_view_analytics_user_id ON view_analytics(user_id);
CREATE INDEX idx_view_analytics_brand_id ON view_analytics(brand_id);
CREATE INDEX idx_view_analytics_timestamp ON view_analytics(timestamp);

CREATE INDEX idx_session_analytics_user_id ON session_analytics(user_id);
CREATE INDEX idx_session_analytics_timestamp ON session_analytics(timestamp);

CREATE INDEX idx_redemption_analytics_brand_id ON redemption_analytics(brand_id);
CREATE INDEX idx_redemption_analytics_timestamp ON redemption_analytics(timestamp);