@AGENTS.md

# VA Marketplace - Developer Guide

## Project Overview
A Fiverr-style marketplace for Dutch virtual assistants, deployed at marketplace.raivenclaw.com.

## Tech Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Auth:** Supabase Auth (server-side via service role key)
- **Database:** Supabase PostgreSQL (tables prefixed with `marketplace_`)
- **Hosting:** Vercel (maarten-essers-projects scope)
- **Domain:** marketplace.raivenclaw.com

## Architecture
- All Supabase operations use the **service role key** server-side (no anon key)
- Auth state stored in httpOnly cookies (`sb-access-token`, `sb-refresh-token`, `sb-user-id`)
- Server actions in `src/lib/actions.ts` handle all mutations
- Server components fetch data directly via `createServerSupabase()`

## Database Tables (all prefixed `marketplace_`)
- `marketplace_profiles` - User profiles (extends auth.users)
- `marketplace_categories` - Service categories (15 seeded)
- `marketplace_services` - Freelancer service offerings
- `marketplace_reviews` - Client reviews of freelancers
- `marketplace_conversations` - Chat conversations
- `marketplace_messages` - Individual messages

## Key Files
- `src/lib/supabase-server.ts` - Server Supabase client + types
- `src/lib/actions.ts` - Server actions (auth, profile, services, messages, reviews)
- `src/app/page.tsx` - Landing page
- `src/app/browse/page.tsx` - Browse/search freelancers
- `src/app/profile/[id]/page.tsx` - Freelancer profile
- `src/app/dashboard/page.tsx` - User dashboard
- `src/app/dashboard/messages/page.tsx` - Messaging
- `src/app/dashboard/settings/page.tsx` - Profile settings

## Commands
```bash
npm run dev    # Development server
npm run build  # Production build
npm run lint   # Lint
```

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL     # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY    # Service role key (server-side only)
```

## Important Notes
- Tables share a Supabase project with the fertility website - all tables are prefixed with `marketplace_`
- RLS is enabled on all tables with service_role bypass policies
- The auth trigger `handle_new_user()` creates both `profiles` and `marketplace_profiles` rows
- Google OAuth is prepared but needs Client ID configuration in Supabase dashboard
- No payment system in this phase
