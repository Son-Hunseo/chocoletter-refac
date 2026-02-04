# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chocoletter is a React + TypeScript + Vite mobile-first web application for anonymous letter/gift exchange (Valentine's Day themed). Users can send "chocolates" (gifts) containing anonymous letters that are time-locked until a scheduled event day.

## Commands

```bash
npm run dev          # Start Vite dev server with HMR
npm run build        # TypeScript compilation + Vite production build
npm run lint         # ESLint on all .ts/.tsx files
npm run preview      # Preview production build locally
```

## Architecture

### Tech Stack
- React 18 with TypeScript
- Vite + SWC for build/HMR
- Recoil for global state management (with localStorage persistence via recoil-persist)
- React Router 7 for client-side routing
- Tailwind CSS for styling
- Axios for HTTP with token refresh interceptors
- STOMP/WebSocket for real-time chat
- OpenVidu for WebRTC video calls

### Directory Structure
```
src/
├── pages/           # Route-level view components (*View.tsx)
├── components/      # Feature-organized React components
├── atoms/           # Recoil state atoms (auth, gift, letter)
├── services/        # API layer (Axios instance + feature APIs)
├── hooks/           # Custom React hooks
├── types/           # TypeScript interfaces
├── utils/           # Helper functions
└── assets/images/   # Static images organized by feature
```

### Key Patterns

**State Management:**
- Global state in `src/atoms/` using Recoil with localStorage persistence
- Key atoms: `isLoginAtom`, `giftBoxIdAtom`, `freeLetterState`, `questionLetterState`

**API Layer:**
- Base Axios instance in `src/services/api.ts` with auto-attached Bearer tokens
- 401 responses trigger automatic token refresh
- Feature-specific API functions in separate files (userApi, giftBoxApi, giftApi, chatApi)

**Routing:**
- Routes defined in `src/App.tsx`
- `ProtectedRoute` wrapper for authenticated pages
- URL params for context (e.g., `/main/:giftBoxId`, `/write/general/:giftBoxId`)

**Authentication:**
- Kakao OAuth login flow
- Tokens stored in localStorage
- User info persisted in both Recoil atoms and localStorage

### Environment Variables
```
VITE_API_SERVER_URL           # Backend API base URL
VITE_KAKAOTALK_JAVASCRIPT_KEY # Kakao SDK key
VITE_EVENT_DAY                # Event date (e.g., 0214 for Feb 14)
VITE_CHAT_WEBSOCKET_ENDPOINT  # WebSocket endpoint for chat
VITE_CHAT_API_URL             # Chat service URL
```

### Mobile-First Design
- App is optimized for mobile viewports (width limited to `md:max-w-sm`)
- Custom `--vh` CSS variable handles mobile 100vh issues (see `useViewportHeight` hook)
- Event-driven features based on Valentine's Day / White Day dates
