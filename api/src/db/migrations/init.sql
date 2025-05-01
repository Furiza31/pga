-- Initialize database schema for Student Association Management Platform

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  deadline TIMESTAMP WITH TIME ZONE,
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Project members (many-to-many relationship between projects and users)
CREATE TABLE IF NOT EXISTS project_members (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, user_id)
);

-- Forum categories
CREATE TABLE IF NOT EXISTS forum_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Forum threads
CREATE TABLE IF NOT EXISTS forum_threads (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category_id INTEGER NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
  created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Forum replies
CREATE TABLE IF NOT EXISTS forum_replies (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  thread_id INTEGER NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
  created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index for frequently accessed columns
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_forum_threads_category_id ON forum_threads(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_thread_id ON forum_replies(thread_id);

-- Insert default admin user with password 'admin123'
-- Warning: This is for initialization only, change in production!
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@example.com', '$2b$10$8MONTRCzbPe/dPyuFWAKIuzoIAOkBUMryWg5lrfcF3kGetE6e52qa	', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert some default forum categories
INSERT INTO forum_categories (name, description)
VALUES 
  ('General', 'General discussions about the association'),
  ('Events', 'Discussions about upcoming and past events'),
  ('Projects', 'Discussions about ongoing projects'),
  ('Help & Support', 'Get help with any association-related questions')
ON CONFLICT DO NOTHING;