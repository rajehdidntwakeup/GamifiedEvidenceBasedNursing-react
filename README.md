# EBNA Escape Room

An immersive clinical escape room platform for evidence-based nursing education. Players solve PICO-based challenges, analyze research studies, and collaborate in real-time to "escape" by demonstrating clinical reasoning skills.

## Overview

EBNA (Evidence-Based Nursing Academy) Escape Room transforms traditional nursing education into an engaging game experience. Players enter themed rooms where they must solve clinical puzzles, interpret research, and decode patient mysteries using evidence-based practice principles.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| UI Components | Radix UI |
| Routing | React Router 7 |
| Animations | Motion |
| Charts | Recharts |
| Forms | React Hook Form |
| Drag & Drop | React DnD |
| Real-time | STOMP over SockJS |
| Date Utils | date-fns |
| Package Manager | pnpm |

## Project Structure

```
src/
├── app/                    # App entry point and routing
├── features/               # Feature modules
│   └── password-gate/      # Password protection for missions
├── pages/                 # Page components
│   ├── landing-page/       # Home page with mission selection
│   ├── admin-dashboard/    # Game monitoring and management
│   ├── room-of-knowledge/  # Knowledge-based challenges
│   ├── room-of-analytics/  # Data analysis room
│   ├── room-of-abstracts/ # Research abstracts room
│   ├── room-of-sciencebattle/ # Clinical debates
│   └── final-stage/       # Final challenge
├── services/              # API clients and auth context
├── shared/                # Shared types and utilities
└── main.tsx               # Application bootstrap
```

## Features

### Core Gameplay
- **Multiple Escape Rooms** — Themed clinical environments (Knowledge, Analytics, Abstracts, Science Battle, Final Stage)
- **Password-Protected Missions** — Secure access to game content
- **Real-time Game State** — Live progress tracking via WebSocket
- **Team Collaboration** — Work with peers to solve challenges

### Admin Dashboard
- **Live Game Monitoring** — Track active teams and progress
- **Game Lifecycle Management** — Start new games, set passwords
- **Team Time Management** — View and extend team timeouts
- **Performance Analytics** — Historical game data and statistics

### Authentication
- **Role-Based Access** — Admin and Player roles
- **Secure Sessions** — Token-based authentication
- **Registration Control** — Admin can enable/disable registration

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8080
VITE_WS_URL=http://localhost:8080/ws
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm lint` | Run ESLint |

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## License

Private — All rights reserved
