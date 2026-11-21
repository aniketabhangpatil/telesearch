-- Initial Seeds for Telegram Channel Finder
USE telegram_channel_finder;

-- Categories Seed Data
INSERT INTO categories (name, slug, description, icon, display_order) VALUES
('Technology & AI', 'technology-ai', 'Artificial Intelligence, Software, Dev, Gadgets and Tech News', 'Cpu', 1),
('Crypto & Web3', 'crypto-web3', 'Bitcoin, Ethereum, DeFi, Trading Signals and Blockchain Insights', 'Coins', 2),
('Business & Finance', 'business-finance', 'Stock Market, Investing, Personal Finance, Startups and Economy', 'TrendingUp', 3),
('Education & Books', 'education-books', 'Online Courses, Academic Resources, Free eBooks and Learning', 'BookOpen', 4),
('Entertainment & Movies', 'entertainment-movies', 'Cinema, Web Series, Pop Culture, Memes and Streaming', 'Film', 5),
('News & Media', 'news-media', 'Global Headlines, Breaking News, Politics and Deep Analysis', 'Newspaper', 6),
('Gaming & Esports', 'gaming-esports', 'Game Updates, Tournaments, Gaming Communities and Reviews', 'Gamepad2', 7),
('Marketing & Growth', 'marketing-growth', 'Digital Marketing, SEO, Social Media Strategies and Copywriting', 'Megaphone', 8),
('Health & Fitness', 'health-fitness', 'Workouts, Nutrition, Mental Wellness and Healthy Living', 'HeartPulse', 9),
('Music & Audio', 'music-audio', 'Independent Artists, New Releases, Playlists and Audiobooks', 'Headphones', 10)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Initial Site Settings
INSERT INTO site_settings (setting_key, setting_value, description) VALUES
('sponsorship_email', 'silkroad2@gmail.com', 'Contact email for channel sponsorship inquiries'),
('developer_email', 'silkroad2.o@gmail.com', 'Direct contact email for platform developer'),
('site_name', 'Telegram Channel Finder', 'Public title of the platform'),
('hero_tagline', 'Discover Verified & High-Value Telegram Communities', 'Homepage hero banner subtitle')
ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);

