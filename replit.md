# Study Dashboard Application

## Overview

A gamified study dashboard application built with React and Express that helps students track their learning progress across different subjects. The app features experience points (XP) tracking, past paper management, daily quests, study streak monitoring, and integration with educational resources. Students can visualize their progress through interactive charts and maintain motivation through gamification elements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks with local storage persistence using custom `useLocalStorage` hook
- **UI Framework**: shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with CSS variables for theming, supporting both light and dark modes
- **Build Tool**: Vite for fast development and optimized production builds
- **Data Fetching**: TanStack Query (React Query) for server state management and caching

### Backend Architecture
- **Framework**: Express.js with TypeScript for robust API development
- **Database ORM**: Drizzle ORM configured for PostgreSQL with schema-first approach
- **Data Storage**: In-memory storage implementation with interface pattern for easy database integration
- **Development**: Hot module replacement and error handling with Vite integration
- **API Structure**: RESTful endpoints with centralized error handling middleware

### Data Management
- **Schema Validation**: Zod schemas for runtime type checking and validation shared between client and server
- **Local Storage**: Browser localStorage for client-side state persistence
- **Database**: PostgreSQL with Drizzle migrations (configured but not yet implemented)
- **Data Models**: Subject XP tracking, past papers, quests, settings, and study streaks

### Development Workflow
- **Monorepo Structure**: Shared types and schemas between client and server in `/shared` directory
- **Path Aliases**: Configured for clean imports (`@/`, `@shared/`, `@assets/`)
- **Hot Reloading**: Vite dev server with Express middleware integration
- **Type Safety**: Comprehensive TypeScript configuration across all packages

### UI/UX Design Patterns
- **Component Architecture**: Reusable UI components following atomic design principles
- **Accessibility**: Radix UI primitives ensure WCAG compliance
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Theme System**: CSS custom properties for consistent design tokens
- **Gamification**: XP bars, progress tracking, and visual feedback for user engagement

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM with PostgreSQL support
- **@tanstack/react-query**: Server state management and caching

### UI Components
- **@radix-ui/***: Comprehensive accessible component primitives (dialogs, dropdowns, forms, etc.)
- **lucide-react**: Icon library for consistent iconography
- **class-variance-authority**: Type-safe component variant management
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling

### Form & Validation
- **react-hook-form**: Performant form library with validation
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Schema validation and type inference

### Educational Resources Integration
- Khan Academy, BBC Bitesize, Save My Exams, and Physics & Maths Tutor for external learning resources

The application follows a clean architecture pattern with clear separation between presentation, business logic, and data layers, making it maintainable and scalable for future enhancements.