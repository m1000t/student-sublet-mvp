# Student Sublet MVP 🏠

A modern student subletting platform built with Next.js, TypeScript, Tailwind CSS, and Supabase. Connect verified students for short-term housing with AI-powered compatibility matching.

## Features

### ✨ Core Features
- **Student Authentication**: Signup/login with university email verification (.edu only)
- **User Profiles**: Name, university, bio, and avatar
- **Listings Management**: Create, edit, delete listings with 1-3 photos
- **Browse & Search**: Filter by price, location, and dates
- **AI Match Score**: OpenAI-powered compatibility (0-100%) based on budget and dates
- **Save/Bookmark**: Heart icon to save favorite listings
- **Messaging**: One-to-one chat between verified students (optional)

### 🎨 Modern UI
- Airbnb-inspired design with card-based layouts
- Fully responsive (mobile, tablet, desktop)
- Smooth transitions and hover effects
- Optimized image handling with Next.js Image

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **AI**: OpenAI API (GPT-3.5-turbo)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key

### 1. Clone the Repository

```bash
git clone https://github.com/m1000t/student-sublet-mvp.git
cd student-sublet-mvp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the database schema (see `supabase-schema.sql`)
3. Go to **Storage** and create a bucket called `listings` with public access
4. Get your project URL and anon key from **Settings > API**

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key
```

### 5. Update Next.js Config

In `next.config.js`, replace the Supabase domain:

```javascript
images: {
  domains: ['your-project-id.supabase.co'],
}
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The app uses 4 main tables:

### users
- `id` (UUID, primary key)
- `email` (text, unique)
- `name` (text)
- `university` (text)
- `bio` (text, optional)
- `avatar_url` (text, optional)
- `created_at` (timestamp)

### listings
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key → users)
- `title` (text)
- `description` (text)
- `rent` (numeric)
- `start_date` (date)
- `end_date` (date)
- `location` (text)
- `images` (text[])
- `created_at` (timestamp)

### saved_listings
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key → users)
- `listing_id` (UUID, foreign key → listings)
- `created_at` (timestamp)

### messages (optional)
- `id` (UUID, primary key)
- `sender_id` (UUID, foreign key → users)
- `receiver_id` (UUID, foreign key → users)
- `listing_id` (UUID, optional)
- `content` (text)
- `read` (boolean)
- `created_at` (timestamp)

## Project Structure

```
student-sublet-mvp/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── listings/
│   │   ├── [id]/page.tsx
│   │   └── create/page.tsx
│   ├── saved/page.tsx
│   ├── profile/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Navbar.tsx
│   ├── ListingCard.tsx
│   └── SearchFilters.tsx
├── lib/
│   ├── supabase.ts
│   ├── openai.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── public/
├── supabase-schema.sql
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Key Features Implementation

### Authentication & .edu Verification

```typescript
function isEduEmail(email: string): boolean {
  return email.toLowerCase().endsWith('.edu');
}
```

### AI Match Score

The app uses OpenAI GPT-3.5-turbo to calculate compatibility scores:

```typescript
await calculateMatchScore(
  listing,
  userBudget,
  userStartDate,
  userEndDate
);
```

Returns a score (0-100) and brief reasoning.

### Image Upload

Images are stored in Supabase Storage with public URLs:

```typescript
const { error } = await supabase.storage
  .from('listings')
  .upload(filePath, file);
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy!

### Deploy Supabase

1. Run the schema SQL in your Supabase project
2. Configure Row Level Security (RLS) policies
3. Enable email confirmations in Auth settings

## Roadmap

- [ ] Real-time messaging system
- [ ] Enhanced AI matching with preferences
- [ ] Reviews and ratings
- [ ] Calendar availability view
- [ ] Mobile app (React Native)
- [ ] Payment integration

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT License - feel free to use this project for your own purposes.

## Contact

Built by [Arnav](https://github.com/m1000t)

---

**Note**: This is an MVP built for rapid deployment. Some features (like messaging) are optional and can be implemented as needed.
