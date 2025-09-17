## GhanaTransit – Final Year Project Documentation

### 1. Executive Summary
GhanaTransit is a modern web application that streamlines intercity bus travel in Ghana. Users can register, login, search routes, book trips, manage a wallet, earn rewards, receive notifications, and track journeys. The app uses Next.js 15 (App Router), Supabase for authentication and database, Tailwind/Shadcn for UI, and Web Push/EmailJS for messaging.

### 2. System Overview
- Purpose: Simplify public transport booking and rider experience in Ghana
- Core Features:
  - Authentication and profiles (Supabase)
  - Route discovery and booking flow (search → select → pay → confirm)
  - Wallet and transactions
  - Rewards and loyalty tracking
  - Notifications (Web Push + Email)
  - Dashboard with insights
  - PWA assets (manifest, service worker)

### 3. Architecture
- Framework: Next.js 15 App Router (server and client components)
- Language: TypeScript with React 19
- Styling: Tailwind CSS + Shadcn UI (Radix primitives)
- State: Local component state + Context providers
  - `AuthProvider`: session/user management
  - `NotificationServiceProvider`: app notifications
  - `ThemeProvider`: dark/light themes
- Data Layer:
  - Supabase client in `lib/supabase.ts`
  - Table access via SDK; aggregates via Postgres RPC (e.g., `get_user_stats`)
  - Background writes to keep UI responsive; local in-memory layer for instant UX via `lib/local-data.ts`
- Security:
  - Supabase session persistence
  - API routes validate `Authorization: Bearer <token>` for protected resources
  - Row Level Security (RLS) configured in SQL scripts

### 4. Project Structure
```
app/
  layout.tsx               # Root layout and providers
  page.tsx                 # Home/dashboard (auth-guarded)
  about/, contact/, help/  # Static pages
  auth/                    # Login, Register, Verify, Callback
  book/, bookings/, routes/, tracking/, wallet/, dashboard/, profile/, settings/
  api/
    auth/resend-verification/route.ts
    notifications/{subscribe,send,unsubscribe}/route.ts
    user/{dashboard,stats}/route.ts
    stripe/create-payment-intent/route.ts    # (ensure this file exists)
components/
  navigation.tsx, hero-slider.tsx, ...
  ui/ (Shadcn primitives)
hooks/                     # use-supabase, use-toast, use-user-dashboard
lib/                       # supabase.ts, notifications.ts, emailjs.ts, auth-config.ts, utils.ts
public/                    # images, manifest.json, sw.js, icons
scripts/                   # SQL schema, RLS policies, seeds, functions
```

### 5. Key Modules
- Root Layout: `app/layout.tsx`
  - Wraps app with `ThemeProvider`, `EmailJSProvider`, `AuthProvider`, `NotificationServiceProvider`, and global `Toaster`.
- Auth Context: `components/auth-provider.tsx`
  - Fetches session on mount
  - Subscribes to `onAuthStateChange`
  - Upserts `profiles` on sign-in
  - Exposes `{ user, loading, signOut, refreshUser }`.
- Supabase Client: `lib/supabase.ts`
  - Creates client from `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Configures PKCE, session persistence
  - Includes TypeScript table interfaces (profiles, routes, buses, bookings, transactions, push_subscriptions, user_activities).
- Navigation: `components/navigation.tsx`
  - Desktop and mobile nav; profile dropdown; theme toggle; notification center.
- Notifications API:
  - `POST /api/notifications/subscribe` – store endpoint (stubbed)
  - `POST /api/notifications/send` – uses `web-push` if VAPID keys present, otherwise logs
  - `POST /api/notifications/unsubscribe` – remove endpoint (stubbed)
- User APIs:
  - `GET /api/user/stats` – calls `rpc('get_user_stats', { user_uuid })`
  - `GET /api/user/dashboard` – joins bookings with routes/buses and lists recent activities; requires Bearer token.

### 6. User Journeys
- Authentication
  - Register/Login via Supabase; session persisted in client
  - Home redirects to `/landing` when unauthenticated
- Booking (app/book/page.tsx)
  1) Search: pick from/to, date, passengers
  2) Select: route + class (standard/VIP), time
  3) Payment: choose method (Mobile Money, Card, Cash)
  4) Confirmation: success screen and redirection to bookings
  - Background DB writes: insert booking, update loyalty points, add user activity
  - Local real-time convenience layer for immediate UI update
- Dashboard (app/page.tsx)
  - Fetches stats via `get_user_stats` and computes loyalty tier (Bronze/Silver/Gold/Platinum)
  - Shows recent activity list and upcoming trips tiles
- Notifications
  - Web Push endpoints; requires `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY`

### 7. Data Model (Essential Tables)
- profiles(id, email, full_name, phone, preferred_language, is_verified, loyalty_points, wallet_balance,...)
- routes(id, name, origin, destination, distance_km, duration_minutes, base_fare,...)
- buses(id, operator_id, route_id, bus_number, capacity, bus_type, amenities[], status,...)
- bookings(id, user_id, route_id, bus_id, seat_number, travel_date, fare_amount, payment_status, booking_status,
           route_from, route_to, departure_date, departure_time, passengers, class, total_price, status,...)
- transactions(id, user_id, booking_id, transaction_type, amount, description, payment_method, status,...)
- user_activities(id, user_id, activity_type, description, metadata, created_at)
- push_subscriptions(id, user_id, endpoint, p256dh, auth, created_at)

### 8. SQL and Backend Setup (scripts/)
- `01-create-database-schema.sql` – tables creation
- `02-create-rls-policies.sql` – enable RLS and policies
- `03-create-functions.sql` – DB functions (e.g., `get_user_stats`)
- `04-seed-sample-data.sql` – sample routes/buses/bookings
- `05-setup-auth-config.sql` – auth-related initializers
- `06-create-payments-table.sql`, `06-update-bookings-schema.sql` – payments and schema updates

### 9. Environment Variables (.env.local)
- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Web Push: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`
- EmailJS: `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`, `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`
- Stripe: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- OAuth (move from code to env): `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`

### 10. Build, Run, Deploy
- Install: `npm install` (for Stripe with React 19: `npm i --legacy-peer-deps`)
- Dev: `npm run dev` → `http://localhost:3000`
- Build: `npm run build`
- Start: `npm start`
- Deploy: Vercel-compatible (`vercel.json`); configure env vars in Vercel project settings

### 11. PWA and Assets
- `public/manifest.json` and `public/sw.js` present
- Add missing `public/icons/icon-144x144.png` to resolve 404 during dev

### 12. Security & Compliance
- Enforce RLS on all user-owned tables
- Validate Supabase sessions in API routes (Bearer token)
- Do not commit OAuth secrets (move from `lib/auth-config.ts` to env)
- Validate inputs with React Hook Form + Zod (recommended)
- Keep `STRIPE_SECRET_KEY` server-side only

### 13. Limitations & Future Work
- `@stripe/react-stripe-js` peers target React ≤18; on React 19 use `--legacy-peer-deps` and test carefully, or render Stripe UI in an isolated React 18 context/service
- Replace demo local data writes with robust queue/retry for eventual consistency
- Real-time bus tracking with backend location updates and a map provider
- Add 2FA, password reset backend, and full email verification flow
- Add automated tests (unit/integration/e2e) and CI pipeline

### 14. References (Code Excerpts)
Home providers:
```tsx
// app/layout.tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
  <EmailJSProvider>
    <AuthProvider>
      <NotificationServiceProvider>
        {children}
        <Toaster />
      </NotificationServiceProvider>
    </AuthProvider>
  </EmailJSProvider>
</ThemeProvider>
```

Supabase RPC usage:
```ts
// app/api/user/stats/route.ts
const { data } = await supabase.rpc("get_user_stats", { user_uuid: user.id })
return NextResponse.json(data || { total_bookings: 0, wallet_balance: 0, loyalty_points: 0, upcoming_trips: 0 })
```

Notifications (Web Push):
```ts
// app/api/notifications/send/route.ts
if (!webpush) {
  return NextResponse.json({ success: true, message: "Notification logged (web-push not configured)" })
}
```

Booking flow (summary):
```tsx
// app/book/page.tsx
// Step 1: Search → Step 2: Select → Step 3: Payment → Step 4: Confirmation
// Background writes to bookings, profiles(loyalty), user_activities
```

### 15. Appendix
- Library versions: see `package.json`
- Config shortcuts:
  - `next.config.mjs`: ignore type/lint errors in build, unoptimized images
  - `tailwind.config.ts`: Tailwind setup and shadcn presets
  - `vercel.json`: Vercel routing/headers if any

---
Prepared by: [Your Name]
Date: [Insert Date]
Institution: [Insert Institution]







