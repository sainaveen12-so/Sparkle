-- Sparkle by Saranya - MySQL Database Setup
-- Run: mysql -u root -p < database/schema.sql

CREATE DATABASE IF NOT EXISTS sparkle_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sparkle_db;

-- Tables are auto-created by SQLAlchemy on backend startup.
-- This script creates the database only.
-- Sample data is seeded automatically via backend/app/seed.py
