# E-commerce Frontend

A modern, responsive e-commerce frontend built with Next.js, TypeScript, and TailwindCSS.

## Features

- **Modern Design**: Clean, professional interface with semantic design tokens
- **Authentication**: Secure JWT-based login and signup
- **Product Browsing**: Grid layout with filtering capabilities
- **Shopping Cart**: Persistent cart functionality
- **Responsive**: Mobile-first design that works on all devices
- **TypeScript**: Full type safety throughout the application
- **Accessibility**: WCAG compliant with proper ARIA labels

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS with semantic design tokens
- **Icons**: Lucide React
- **State Management**: React hooks with localStorage persistence

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see backend README)

### Installation

1. Navigate to the frontend directory:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create environment file:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Update environment variables:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000
\`\`\`

### Development

Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The application will be available at \`http://localhost:3000\`

### Build

Create a production build:
\`\`\`bash
npm run build
npm start
\`\`\`

## Project Structure

\`\`\`
frontend/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles with design tokens
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx          # Homepage
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── products/         # Products listing page
│   └── cart/             # Shopping cart page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── navbar.tsx        # Navigation component
├── lib/                  # Utility functions and services
│   ├── api.ts           # API client
│   ├── auth.ts          # Authentication service
│   └── types.ts         # TypeScript interfaces
└── public/              # Static assets
\`\`\`

## Design System

The application uses a semantic design token system with a green-focused color palette:

- **Primary**: Green (#15803d) for main actions
- **Secondary**: Bright green (#84cc16) for accents
- **Neutrals**: White, light green tints, and dark gray
- **Typography**: Geist Sans for headings and body text

## Authentication Flow

1. Users can sign up with name, email, and password
2. JWT tokens are stored in localStorage
3. Protected routes redirect to login if not authenticated
4. User state persists across browser sessions

## API Integration

The frontend communicates with the backend API using:

- **Base URL**: Configurable via environment variables
- **Authentication**: JWT tokens in Authorization headers
- **Error Handling**: Consistent error responses with user feedback
- **Type Safety**: Full TypeScript interfaces for all API responses

## Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Breakpoints**: Uses Tailwind's responsive prefixes (sm, md, lg, xl)
- **Touch Friendly**: Appropriate touch targets and spacing
- **Performance**: Optimized images and lazy loading

## Accessibility

- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Screen reader support for interactive elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG AA compliant color combinations
- **Focus Management**: Visible focus indicators

## Performance

- **Next.js Optimizations**: Automatic code splitting and optimization
- **Image Optimization**: Next.js Image component for optimal loading
- **Bundle Analysis**: Built-in bundle analyzer for size monitoring
- **Caching**: Proper HTTP caching headers and strategies
\`\`\`
