# RTI Agency

A complete web application for RTI Agency built with React, TypeScript, Supabase, and Tailwind CSS.

## Tech Stack

- **Frontend**: React 19 with TypeScript, Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation
- **Video Player**: React Player
- **Notifications**: React Hot Toast

## Features

- Authentication with role-based access (Admin, Employee, Client)
- Admin Dashboard with metrics
- Form management system
- Video training platform with engagement tracking
- Announcements system
- Services and inquiries

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy environment file and add your Supabase credentials:
```bash
cp .env.example .env
```

3. Run the database schema in Supabase SQL Editor (see `supabase/schema.sql`)

4. Start the dev server:
```bash
npm run dev
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
