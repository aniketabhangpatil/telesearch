# Setup & Operations Guide: Telegram Channel Finder

This document contains step-by-step instructions for Windows 11 PowerShell, MySQL Workbench, database configuration, admin authentication, and server startup/shutdown.

---

## 1. Prerequisites Verified

- **OS:** Windows 11
- **Node.js:** v26.12.1 (or v18+)
- **npm:** 11.20.0
- **MySQL Server:** 8.0 running on `localhost:3306` (Service: `MySQL80`)
- **MySQL Workbench 8.0:** Installed

---

## 2. MySQL Configuration & Database Initialization

### Option A: Using the Automated Node.js Script
1. Open Windows PowerShell and navigate to the backend directory:
   ```powershell
   cd "C:\Users\DELL\OneDrive\Desktop\telesearch\Telegram-Channel-Finder\backend"
   ```
2. Ensure your MySQL password is set in `backend/.env`:
   ```env
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
   DB_NAME=telegram_channel_finder
   ```
3. Run the automated initialization command:
   ```powershell
   npm run init-db
   ```
   This script will:
   - Create database `telegram_channel_finder` if it does not exist.
   - Execute `schema.sql` (creates `categories`, `channels`, `sponsored_channels`, `admin_users`, `site_settings`).
   - Execute `seed.sql` (populates default categories and site settings).
   - Safely hash the initial password with `bcrypt` (10 rounds) and create admin `silkroad2.o`.

---

### Option B: Using MySQL Workbench 8.0
1. Open **MySQL Workbench 8.0**.
2. Connect to your `Local instance MySQL80` (user: `root`).
3. Click **File -> Open SQL Script...** and select:
   `C:\Users\DELL\OneDrive\Desktop\telesearch\Telegram-Channel-Finder\database\schema.sql`
4. Click the **Execute (Lightning icon)** to run the entire script.
5. Click **File -> Open SQL Script...** and select:
   `C:\Users\DELL\OneDrive\Desktop\telesearch\Telegram-Channel-Finder\database\seed.sql`
6. Click the **Execute** button to seed categories and settings.
7. Next, run `npm run init-db` in the backend folder to create the bcrypt-hashed admin user record.

---

## 3. Initial Admin Credentials

- **Admin Username:** `silkroad2.o`
- **Initial Password:** `silkroad3.o`

> **Security Note:** Credentials are never hardcoded or prefilled into the frontend interface. The password can be updated directly from the **Settings & Security** tab inside the Admin Dashboard after logging in.

---

## 4. Local Startup Commands

### Start the Backend Server (Express on port 5000):
Open a new PowerShell window:
```powershell
cd "C:\Users\DELL\OneDrive\Desktop\telesearch\Telegram-Channel-Finder\backend"
npm start
```
*Backend will be online at:* `http://localhost:5000`  
*API Health check:* `http://localhost:5000/api/health`

### Start the Frontend Application (Vite on port 5173):
Open a second PowerShell window:
```powershell
cd "C:\Users\DELL\OneDrive\Desktop\telesearch\Telegram-Channel-Finder\frontend"
npm run dev
```
*Frontend will be online at:* `http://localhost:5173`

---

## 5. Local Shutdown Commands

To stop running servers:
- In the PowerShell terminal running the server, press `Ctrl + C` and type `Y` when prompted.
- Or to kill processes from PowerShell:
  ```powershell
  # Stop backend port 5000
  Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
  # Stop frontend port 5173
  Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
  ```

