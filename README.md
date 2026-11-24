# Telegram Channel Finder

A premium, full-stack web platform for discovering, searching, and exploring verified Telegram channels with relevance-ranked discovery, advanced Framer Motion radial/orbital animations, a Top 100 sponsored directory, free community submissions, and a comprehensive private administration portal.

---

## 🌟 Key Features

1. **Relevance-Weighted Search Engine (Traditional Non-AI MySQL):**
   - Exact Name Match: **100 pts**
   - Name Contains Query: **60 pts**
   - Individual Name Keyword: **15 pts each**
   - Link Contains Query: **30 pts**
   - Description Contains Query: **20 pts**
   - Individual Description Keyword: **5 pts each**
   - Multi-keyword tokenization, case-insensitive partial matching, relevance ranking, and pagination.
   - Only approved channels are searchable. All queries use prepared statements.

2. **Top 10 Signature Radial/Orbital Showcase:**
   - Advanced Framer Motion orbital layout (not a generic carousel).
   - Channels emerge from the center and spread outward in an elliptical orbit.
   - Smooth floating drift, staggered spring animations, neon glow, and 3D hover scale.
   - Working **JOIN CHANNEL** button linking directly to verified Telegram URLs.
   - Responsive fallback grid for mobile and tablets.
   - Full reduced-motion accessibility support.

3. **Top 100 Sponsored Directory:**
   - Dedicated partner directory enforcing a strict 100-channel maximum transactionally.
   - Official partner badge styling, rank numbering (#1 to #100), and 1-click join buttons.
   - Admin can add, edit, reorder, and remove channels without any automated or expiration dates.

4. **100% Free Public Channel Submission:**
   - Public form requiring no login or account creation.
   - Validates Telegram handles (`@handle` or `https://t.me/handle`), descriptions, categories, languages, and logos.
   - Duplicate prevention on unique Telegram links.
   - Submissions enter `pending` state until reviewed and approved by an administrator.

5. **Private Admin Command Center:**
   - Secure HTTP-only cookie sessions and bcrypt password hashing.
   - Unprefilled login form and rate-limited authentication (`/api/auth/login`).
   - Real-time statistics: total channels, pending submissions, approved count, sponsored count, featured count.
   - 1-click approval and rejection with feedback reasons.
   - Drag/arrow reordering for Top 100 Sponsored and Top 10 Featured channels.
   - Live settings editor for Sponsorship Email and Developer Email.
   - Secure password changing with verification.

6. **Contact & Developer Systems:**
   - Animated **"SPONSOR YOUR TELEGRAM CHANNEL"** CTA banner opening prefilled email to the sponsorship address.
   - Developer profile for **Aniket Abhang Patil**, Software Developer & Founder, with circular AA avatar and functional links to LinkedIn, GitHub, Instagram, and Email.
   - Both contact emails editable anytime via Admin Settings.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite 6, Tailwind CSS, Framer Motion, Lucide React
- **Backend:** Node.js, Express.js, `mysql2/promise`, `bcrypt`, `express-session`, `multer`, `helmet`, `express-rate-limit`
- **Database:** MySQL 8.0 (`telegram_channel_finder`)
- **Architecture:** Decoupled RESTful API with CORS & HTTP-only sessions

---

## 📁 Project Structure

```
Telegram-Channel-Finder/
├── backend/
│   ├── config/
│   │   └── db.js                 # MySQL connection pool
│   ├── controllers/
│   │   ├── adminController.js    # Admin statistics, channels, sponsored, settings
│   │   ├── authController.js     # Admin login, logout, password change
│   │   ├── channelController.js  # Search, categories, submission
│   │   ├── settingsController.js # Public site settings
│   │   └── sponsoredController.js# Top 100 sponsored & Top 10 featured
│   ├── middleware/
│   │   ├── authMiddleware.js     # Protected admin route session guard
│   │   ├── rateLimiter.js        # Brute-force & spam protection
│   │   └── uploadMiddleware.js   # Multer file upload for logos
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── channels.js
│   │   ├── settings.js
│   │   └── sponsored.js
│   ├── scripts/
│   │   └── initDb.js             # Automated DB creator, schema runner & admin seeder
│   ├── uploads/                  # Uploaded channel logos
│   ├── .env                      # Backend configuration
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express server entry point
├── database/
│   ├── schema.sql                # Complete MySQL DDL tables, constraints, indexes
│   └── seed.sql                  # Initial categories & site settings
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js            # REST API client
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   └── AdminLoginModal.jsx
│   │   │   ├── CategoriesSection.jsx
│   │   │   ├── DeveloperProfile.jsx
│   │   │   ├── FeaturedOrbit.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Icons.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── SearchHero.jsx
│   │   │   ├── SearchResults.jsx
│   │   │   ├── SponsorshipBanner.jsx
│   │   │   ├── SubmissionSection.jsx
│   │   │   └── Toast.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

