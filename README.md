# Our Little World

A private, realtime little world for two.

## Stack
- Next.js + React + TypeScript
- Supabase for Auth, Postgres, Storage and Realtime
- Vercel for deployment
- PWA install support for iPhone and Android

## Local setup
```bash
npm install
npm run dev
```

Create `.env.local` later with:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

The first UI is intentionally functional without Supabase so the product can be designed and tested before the backend is connected.

## Planned realtime model
- profiles
- couples / rooms
- room_presence
- room_items
- notes
- gifts
- memories
- games
- music_state
