-- Telegram Channel Finder Database Schema
-- MySQL 8.0 Compatible

CREATE DATABASE IF NOT EXISTS telegram_channel_finder 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE telegram_channel_finder;

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NULL,
  icon VARCHAR(50) DEFAULT 'Compass',
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Channels Table
CREATE TABLE IF NOT EXISTS channels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  telegram_url VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category_id INT NOT NULL,
  keywords VARCHAR(500) NULL,
  language VARCHAR(50) DEFAULT 'English',
  logo_url VARCHAR(500) NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  rejection_reason VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  INDEX idx_channels_status (status),
  INDEX idx_channels_category (category_id),
  INDEX idx_channels_name (name)
) ENGINE=InnoDB;

-- Sponsored Channels Table (Enforced max 100, max 10 featured)
CREATE TABLE IF NOT EXISTS sponsored_channels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  channel_id INT NOT NULL UNIQUE,
  display_order INT NOT NULL DEFAULT 1,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  featured_order INT NULL,
  badge_text VARCHAR(50) DEFAULT 'Featured Partner',
  notes VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE,
  INDEX idx_sponsored_order (display_order),
  INDEX idx_sponsored_featured (is_featured, featured_order)
) ENGINE=InnoDB;

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  description VARCHAR(255) NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

