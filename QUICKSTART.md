# 🚀 WanderHub - Quick Start Guide

## ⚡ Get Running in 5 Minutes!

### Step 1: Create `.env` File

Create a file named `.env` in the root directory and add your API keys:

```env
# Database
DATABASE_URL="your-database-connection-string"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google APIs
GOOGLE_PLACES_API_KEY="your-google-places-key"
GOOGLE_MAPS_API_KEY="your-google-maps-key"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-key"
GOOGLE_GEMINI_API_KEY="your-gemini-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Step 2: Generate Prisma Client & Setup Database

```bash
npx prisma generate
npx prisma db push
```

### Step 3: Run the Development Server

```bash
npm run dev
```

### Step 4: Open Your Browser

Visit: **http://localhost:3000**

---

## 🔑 Where to Get API Keys

### 1. **Google Places API** (5 minutes)
- Go to: https://console.cloud.google.com/
- Enable "Places API" and "Maps JavaScript API"
- Create API Key
- Copy to `.env` as `GOOGLE_PLACES_API_KEY`

### 2. **Google Gemini AI** (2 minutes)
- Go to: https://makersuite.google.com/app/apikey
- Click "Get API Key"
- Copy to `.env` as `GOOGLE_GEMINI_API_KEY`

### 3. **Google OAuth** (5 minutes)
- Go to: https://console.cloud.google.com/apis/credentials
- Create OAuth 2.0 Client
- Add redirect URI: `http://localhost:3000/api/auth/callback/google`
- Copy Client ID and Secret to `.env`

### 4. **Database** (5 minutes)
**Option A: Supabase (Recommended)**
- Go to: https://supabase.com
- Create new project
- Copy connection string to `.env`

**Option B: Railway**
- Go to: https://railway.app
- Create PostgreSQL database
- Copy connection string to `.env`

### 5. **NextAuth Secret**
Generate in terminal:
```bash
openssl rand -base64 32
```
Copy output to `.env` as `NEXTAUTH_SECRET`

---

## ✅ Test Your Setup

### 1. **Landing Page**
- Visit http://localhost:3000
- You should see the hero section with search form

### 2. **Search for Destinations**
- Type "beaches" or "waterfalls" in search
- Click "Explore Destinations"
- You should see results from Google Places

### 3. **View Destination Details**
- Click any destination card
- You should see:
  - Images from Google
  - "Get Directions" button
  - "View on Google Maps" link
  - Embedded map
  - AI chatbot button

### 4. **Test AI Chatbot**
- Click the chatbot icon
- Ask: "What's the best time to visit?"
- The AI should respond with relevant information

### 5. **Test Authentication**
- Click "Sign In" in navigation
- Sign in with Google
- You should be redirected to dashboard

---

## 🎯 Key Features to Test

### Smart Search
1. Go to homepage
2. Try searching:
   - **"beaches near Mumbai"**
   - **"quiet waterfalls"**
   - **"temples in Bali"**
   - **"hidden hills"**

### Google Maps Integration
1. Open any destination
2. Click **"Get Directions"** → Opens Google Maps with route
3. Click **"View on Google Maps"** → Opens place page
4. See embedded map showing exact location

### AI Chatbot
1. Open any destination
2. Click chatbot icon
3. Ask questions:
   - "What's the weather like?"
   - "Best time to visit?"
   - "What food should I try?"
   - "Is it crowded?"

### Personalization
1. Sign in with Google
2. Go to Dashboard → Survey
3. Complete preferences survey
4. See personalized recommendations

### Save Favorites
1. Open any destination
2. Click the heart icon
3. Go to Dashboard → Favorites
4. See your saved destinations

---

## 🐛 Common Issues & Fixes

### Issue: "GOOGLE_PLACES_API_KEY is not set"
**Fix:** 
- Check `.env` file exists in root directory
- Restart dev server: `npm run dev`

### Issue: No search results appearing
**Fix:**
- Verify Google Places API is enabled in console
- Check API key has no restrictions
- Look at browser console for errors

### Issue: Maps not loading
**Fix:**
- Ensure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set
- Enable "Maps Embed API" in Google Cloud Console
- Clear browser cache

### Issue: Chatbot not responding
**Fix:**
- Verify `GOOGLE_GEMINI_API_KEY` is correct
- Check you haven't exceeded free tier quota
- Look at terminal logs for errors

### Issue: Database connection error
**Fix:**
- Verify `DATABASE_URL` format is correct
- Ensure database is accessible
- Run `npx prisma db push` again

---

## 📱 What You'll See

### Landing Page
- Hero section with search form
- Interest category cards (Beaches, Mountains, etc.)
- How it works section
- Testimonials
- Modern travel-themed design

### Search Results
- Grid of destination cards
- Each card shows:
  - Photo from Google Places
  - Destination name
  - Rating (stars)
  - Category badge
  - Distance (if location enabled)

### Destination Detail Page
- Large hero image
- Destination name and rating
- Address with map icon
- Description
- **"Get Directions" button** (opens Google Maps)
- **"View on Google Maps" link**
- **Embedded Google Map**
- AI chatbot button
- Hotel and transport options
- Related destinations

### Dashboard
- User statistics
- Saved destinations
- Recent searches
- Personalized recommendations

---

## 🎨 Customization

### Change Color Theme
Edit `tailwind.config.ts`:
```ts
primary: {
  500: '#1890ff',  // Change this hex code
  600: '#096dd9',
}
```

### Add More Categories
Edit `app/page.tsx` (line 41):
```ts
{ name: "Wildlife", icon: "🦁", color: "from-green-400 to-lime-500" },
```

### Modify AI Chatbot Behavior
Edit `lib/gemini.ts` (line 26):
```ts
export function createSystemPrompt(destination: DestinationContext): string {
  return `You are... [customize prompt here]`
}
```

---

## 🚀 Next Steps

1. ✅ Get your API keys
2. ✅ Run the project
3. ✅ Test all features
4. 📚 Read `PROJECT_STATUS.md` for complete documentation
5. 🌐 Deploy to Vercel (optional)

---

## 📞 Need Help?

- Check `PROJECT_STATUS.md` for detailed documentation
- Check `SETUP.md` for API key guides
- Review `FINISHING_TOUCHES.md` for feature list
- Look at code comments in files

---

**🎉 Enjoy building with WanderHub!**

Your complete smart tourism platform is ready to discover hidden gems worldwide! 🌍✈️
