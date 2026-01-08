# WanderHub - Smart Tourism Solution

A comprehensive travel and tourism web application that provides personalized destination discovery, AI-powered travel guidance, and location-based recommendations.

## Features

- **Smart Search**: Find destinations based on interests (e.g., "quiet hills") rather than just names
- **AI Chatbot**: Contextual AI assistant powered by Google Gemini that knows about specific destinations
- **Price Comparison**: Aggregated hotel and transport prices
- **Location-Based Notifications**: Discover destinations within 50km based on your preferences
- **User Dashboard**: Track favorites, visits, and get personalized recommendations

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js v5
- **AI**: Google Gemini AI
- **APIs**: Google Places API, Google Maps API

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Supabase or Railway)
- Google Cloud Platform account with APIs enabled:
  - Google Places API
  - Google Maps API
  - Google Gemini API

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd WanderHub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL`: Your app URL (e.g., `http://localhost:3000`)
- `GOOGLE_PLACES_API_KEY`: Your Google Places API key
- `GOOGLE_MAPS_API_KEY`: Your Google Maps API key
- `GOOGLE_GEMINI_API_KEY`: Your Google Gemini API key
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
WanderHub/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── destination/       # Destination detail pages
│   ├── search/           # Search pages
│   └── page.tsx          # Landing page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── chatbot.tsx       # AI chatbot component
├── lib/                  # Utility functions
│   ├── prisma.ts         # Prisma client
│   ├── google-places.ts  # Google Places API helpers
│   ├── gemini.ts         # Gemini AI integration
│   └── haversine.ts      # Distance calculations
└── prisma/               # Database schema
    └── schema.prisma
```

## Key Features Implementation

### Smart Search
The search API (`/api/search`) uses Google Places API to find destinations and matches them with user interests. Results are sorted by distance using the Haversine formula.

### AI Chatbot
The chatbot (`/api/chat`) uses Google Gemini AI with contextual system prompts that include destination-specific information, making it an expert on each place.

### Database Population
Destinations are populated dynamically from Google Places API when users search. The system uses upsert logic to cache results in the database.

### Notifications
The notification system (`/api/notifications`) finds destinations within 50km and scores them based on:
- Distance from user
- Category match with user interests
- Rating and popularity

## Database Schema

The application uses 8 main models:
- `User`: User accounts and preferences
- `Destination`: Places and attractions
- `Hotel`: Hotel listings
- `Transport`: Transportation options
- `UserSurvey`: User onboarding preferences
- `UserFavorite`: Saved destinations
- `UserVisit`: Visited destinations
- Plus NextAuth models (`Account`, `Session`, `VerificationToken`)

## API Routes

- `GET /api/search`: Search destinations
- `GET /api/destination/[id]`: Get destination details
- `POST /api/chat`: Chat with AI assistant
- `GET /api/user/stats`: Get user statistics
- `POST /api/user/survey`: Save user preferences
- `GET /api/notifications`: Get nearby destinations

## Development

```bash
# Run development server
npm run dev

# Generate Prisma client
npm run db:generate

# Push database changes
npm run db:push

# Open Prisma Studio
npm run db:studio
```

## Deployment

1. Set up your PostgreSQL database
2. Configure environment variables in your hosting platform
3. Run database migrations
4. Deploy to Vercel, Railway, or your preferred platform

## License

ISC


