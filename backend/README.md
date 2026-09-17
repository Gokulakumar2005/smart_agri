# Smart Agriculture Assistant

A full-stack MERN application for crop planning, weather-aware irrigation recommendations, plant health assessment, and admin management for farmers.

## Features
- Farmer signup/login with JWT auth and role-based protections
- Crop planning for Paddy, Banana, and Tomato
- Weather insights with irrigation delay recommendation
- AI/ML-like plant health diagnosis with a rule-based fallback
- Admin tools for crop knowledge, users, and health reports
- Responsive web interface built with React and Tailwind

## Prerequisites
- Node.js 18+
- MongoDB running locally or via Atlas
- npm package manager

## Backend setup
1. Go to the backend folder.
2. Copy `.env.example` to `.env` and set values.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Seed crops and default admin account:
   ```bash
   npm run seed
   ```
5. Start the backend:
   ```bash
   npm run dev
   ```

## Frontend setup
1. Go to the frontend folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend dev server:
   ```bash
   npm run dev
   ```

## Default admin credentials
- Email: admin@smartagri.local
- Password: admin123

Update these values in your backend `.env` before production use.

## Notes on provider switching
- Weather provider defaults to Open-Meteo; set `WEATHER_PROVIDER=openweathermap` and add `OPENWEATHER_API_KEY` for production use.
- Plant health diagnosis falls back to a mock rule-based system when `PLANT_ID_API_KEY` is not configured.
- API keys and secrets must be kept in `.env` and not committed to source control.
