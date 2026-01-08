# WanderHub Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   - Copy `.env.example` to `.env`
   - Fill in all required API keys and secrets

3. **Set Up Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Required API Keys

### Google Places API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable "Places API"
3. Create an API key
4. Add to `.env` as `GOOGLE_PLACES_API_KEY`

### Google Maps API
1. Enable "Maps Embed API" and "Maps JavaScript API"
2. Create an API key (can use same as Places API)
3. Add to `.env` as `GOOGLE_MAPS_API_KEY`
4. **Important**: Also add to `.env` as `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` for client-side use

### Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add to `.env` as `GOOGLE_GEMINI_API_KEY`

### Google OAuth (for Authentication)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.env`

### NextAuth Secret
Generate a random secret:
```bash
openssl rand -base64 32
```
Add to `.env` as `NEXTAUTH_SECRET`

## Database Setup

### Option 1: Supabase (Recommended)
1. Create a new project at [Supabase](https://supabase.com)
2. Copy the connection string from Settings > Database
3. Add to `.env` as `DATABASE_URL`

### Option 2: Railway
1. Create a new PostgreSQL database at [Railway](https://railway.app)
2. Copy the connection string
3. Add to `.env` as `DATABASE_URL`

## Environment Variables Checklist

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Google APIs
GOOGLE_PLACES_API_KEY="..."
GOOGLE_MAPS_API_KEY="..."
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="..."  # Same as above, for client-side
GOOGLE_GEMINI_API_KEY="..."

# OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

## Testing the Application

1. **Landing Page**: Visit `http://localhost:3000`
2. **Search**: Go to `/search` and try searching for "beaches" or "hills"
3. **Destination Details**: Click on any destination from search results
4. **Authentication**: Click "Sign In" to test Google OAuth
5. **Dashboard**: After signing in, visit `/dashboard`
6. **Survey**: Complete the survey at `/dashboard/survey`
7. **Chatbot**: Open a destination and click "Ask AI Assistant"

## Common Issues

### "GOOGLE_PLACES_API_KEY is not set"
- Make sure your `.env` file is in the root directory
- Restart the development server after adding environment variables

### Database connection errors
- Verify your `DATABASE_URL` is correct
- Make sure your database is accessible
- Run `npx prisma db push` to sync the schema

### Maps not showing
- Ensure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set
- Check that Maps Embed API is enabled in Google Cloud Console
- Verify API key restrictions allow your domain

### Authentication not working
- Check that OAuth credentials are correct
- Verify redirect URI matches exactly
- Ensure NextAuth secret is set

## Next Steps

- Customize the UI colors in `tailwind.config.ts`
- Add more destination categories
- Implement hotel/transport scraping (currently uses mock data)
- Add more AI features
- Set up production deployment


