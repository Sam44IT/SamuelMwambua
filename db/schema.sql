CREATE TABLE IF NOT EXISTS portfolio_sections (
  id SERIAL PRIMARY KEY,
  section_name VARCHAR(100) UNIQUE NOT NULL,
  content JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  event_category VARCHAR(20) NOT NULL,
  admin_username VARCHAR(100),
  action VARCHAR(50) NOT NULL,
  section VARCHAR(100),
  old_value JSONB,
  new_value JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  status VARCHAR(20),
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_login_otps (
  id UUID PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  hashed_otp TEXT NOT NULL,
  ip_address VARCHAR(50),
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  consumed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portfolio_backups (
  id SERIAL PRIMARY KEY,
  section_name VARCHAR(100),
  snapshot JSONB NOT NULL,
  saved_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
