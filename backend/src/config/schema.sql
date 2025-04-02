-- Create database if not exists
CREATE DATABASE IF NOT EXISTS awil_db;
USE awil_db;

-- Create themes table
CREATE TABLE IF NOT EXISTS themes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create subthemes table
CREATE TABLE IF NOT EXISTS subthemes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    theme_id INTEGER REFERENCES themes(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subtheme_id INTEGER REFERENCES subthemes(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create names table
CREATE TABLE IF NOT EXISTS names (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create name_categories table
CREATE TABLE IF NOT EXISTS name_categories (
    id SERIAL PRIMARY KEY,
    name_id INTEGER REFERENCES names(id),
    category_id INTEGER REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin table
CREATE TABLE IF NOT EXISTS admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO admin (username, password) 
VALUES ('admin', '$2a$10$YourHashedPasswordHere')
ON CONFLICT (username) DO NOTHING; 