# BEENAS - Fashion E-commerce

## Overview
BEENAS is a fashion e-commerce application built with React, TypeScript, and Vite. It features a modern, elegant design for showcasing fashion collections.

## Tech Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM v6
- **State Management**: TanStack React Query v5
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation

## Project Structure
```
src/
├── assets/          # Static assets
├── components/      # React components
│   └── admin/       # Admin panel components
├── context/         # React context providers
├── data/            # Data files and configurations
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries
├── pages/           # Page components
├── services/        # API services
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── App.tsx          # Main app component
├── App.css          # App styles
├── index.css        # Global styles
└── main.tsx         # App entry point
```

## Running the Project
The application runs on port 5000 using `npm run dev`.

## Features
- Fashion product catalog
- Collections browsing
- New arrivals section
- Best sellers section
- Admin dashboard for product management
- Shopping cart functionality

## Recent Changes
- 2024-12-31: Migrated from Lovable to Replit environment
  - Updated Vite config for Replit compatibility (port 5000, allowedHosts)
  - Configured deployment settings
