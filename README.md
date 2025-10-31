# ReservasiKu - Next.js + Supabase

Platform booking online untuk barbershop, nail art, photobooth, dan bisnis layanan lainnya.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **Storage**: Supabase Storage
- **Styling**: Tailwind CSS v4
- **Deployment**: Vercel

## Features

✅ **Business Profile Pages** - Dynamic routes dengan theme per bisnis
✅ **Booking System** - Form booking dengan payment method selection
✅ **Payment Options** - Bayar di lokasi atau transfer bank
✅ **Payment Proof Upload** - Upload bukti transfer ke Supabase Storage
✅ **Real-time Preview** - Preview image sebelum upload
✅ **Validation** - File type & size validation
✅ **Bank Info Display** - Conditional display nomor rekening

## Setup Instructions

### 1. Clone & Install Dependencies

```bash
cd /Users/bagus/web/reservasi-nextjs
npm install
```

### 2. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Di Supabase Dashboard:
   - Go to **Settings > API** dan copy:
     - `Project URL`
     - `anon/public` key
     - `service_role` key (secret)
   - Go to **Settings > Database** dan copy:
     - `Connection string` (untuk DATABASE_URL)
     - `Direct connection` (untuk DIRECT_URL)

3. Setup Storage Buckets:
   - Go to **Storage** di dashboard
   - Create bucket: `payment-proofs` (public)
   - Create bucket: `business-photos` (public)

### 3. Environment Variables

Copy `.env.example` ke `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Google OAuth (optional untuk fase ini)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 4. Database Migration

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio
npx prisma studio
```

### 5. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Routes

### Public Routes
- `/` - Landing page
- `/[slug]` - Business profile (contoh: `/komet`, `/JenaNail`, `/memorias`)

### API Routes
- `POST /api/bookings` - Create booking
- `GET /api/bookings?business_id=xxx` - Get bookings
- `POST /api/upload` - Upload file to Supabase Storage

## Demo Businesses

Sudah ada 3 dummy businesses untuk testing:

1. **Komet Barbershop** - `/komet`
   - Theme: Slate + Amber
   - Services: Haircut, Styling, Coloring

2. **JenaNail Studio** - `/JenaNail`
   - Theme: Pink + Purple
   - Services: Manicure, Gel Polish, Nail Art

3. **Memorias Photobooth** - `/memorias`
   - Theme: Orange + Teal
   - Services: Photobooth packages

## Project Structure

```
reservasi-nextjs/
├── app/
│   ├── (public)/
│   │   └── [slug]/page.tsx       # Business profile pages
│   ├── api/
│   │   ├── bookings/route.ts     # Booking API
│   │   └── upload/route.ts       # Upload API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Landing page
├── components/
│   └── booking/
│       ├── BookingForm.tsx       # Main booking form
│       ├── PaymentMethodSelect.tsx
│       └── PaymentProofUpload.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── middleware.ts         # Session management
│   ├── prisma.ts                 # Prisma client
│   ├── themes.ts                 # Theme configuration
│   └── dummy-data.ts             # Demo data
├── prisma/
│   └── schema.prisma             # Database schema
└── types/
    └── index.ts                  # TypeScript types
```

## Database Schema

### Tables
- `users` - User accounts (NextAuth)
- `accounts` - OAuth accounts
- `sessions` - User sessions
- `businesses` - Business profiles
- `services` - Business services
- `bookings` - Customer bookings

### Key Features
- Payment method support (onsite/transfer)
- Payment proof URL storage
- Full relationships & indexes
- PostgreSQL with Prisma

## Next Steps

### Phase 2 (Coming Soon)
- [ ] NextAuth integration dengan Google OAuth
- [ ] Owner dashboard untuk kelola booking
- [ ] Onboarding flow untuk business setup
- [ ] Email notifications
- [ ] WhatsApp integration

### Phase 3
- [ ] Calendar view untuk booking
- [ ] Service selection dalam form
- [ ] Payment status tracking
- [ ] Analytics dashboard
- [ ] Review & rating system

## Deployment

### Vercel

1. Push code ke GitHub
2. Import project ke Vercel
3. Set environment variables
4. Deploy!

Vercel akan auto-detect Next.js dan setup semuanya.

## Contributing

Ini adalah private project untuk ReservasiKu.

## License

Proprietary - All rights reserved
