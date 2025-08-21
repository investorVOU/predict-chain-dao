# Overview

PredictChain DAO is a decentralized prediction market platform built with a modern full-stack architecture. The application allows users to create and participate in prediction markets, vote on governance proposals, earn NFT rewards, and manage their profiles. It combines Web3 functionality with traditional web technologies to deliver a sophisticated prediction platform with DAO governance capabilities.

The platform features comprehensive market management, user analytics, reward systems, and decentralized governance, all wrapped in a sleek, responsive interface built with modern design patterns.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern development patterns
- **Build Tool**: Vite for fast development and optimized production builds  
- **UI Framework**: Tailwind CSS with shadcn/ui components for consistent, accessible design system
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: React Router for client-side navigation with proper route handling
- **Animations**: Framer Motion for smooth, performant UI animations and transitions
- **Responsive Design**: Mobile-first approach with Tailwind's responsive utilities

## Backend Architecture  
- **Runtime**: Node.js with Express.js framework for REST API development
- **Language**: TypeScript throughout for consistency and type safety
- **Development**: tsx for TypeScript execution in development mode
- **Production Build**: esbuild for fast, optimized server bundling
- **Storage Layer**: Abstracted storage interface with in-memory implementation (MemStorage)

## Data Storage Solutions
- **Database**: PostgreSQL configured via Drizzle ORM for type-safe database interactions
- **Schema Management**: Drizzle Kit for migrations and schema synchronization  
- **Connection**: Neon Database serverless PostgreSQL for scalable cloud database hosting
- **Session Storage**: PostgreSQL-backed session storage using connect-pg-simple
- **Development Storage**: In-memory storage implementation for rapid prototyping

## Authentication and Authorization
- **Web3 Integration**: Thirdweb SDK for wallet connection and blockchain interactions
- **Wallet Support**: Multi-wallet support through Thirdweb's connection infrastructure
- **Session Management**: Express sessions with PostgreSQL persistence
- **User Management**: Database-backed user profiles with username/password authentication

## Component Architecture
- **Design System**: shadcn/ui component library with customizable Radix UI primitives
- **Form Handling**: React Hook Form with Zod validation for type-safe form management  
- **Layout System**: Responsive navigation with mobile-friendly sidebar/sheet patterns
- **Card-Based UI**: Consistent card patterns for predictions, proposals, and user content
- **Theme System**: CSS variables-based theming with dark mode optimized color palette

# External Dependencies

## Blockchain and Web3
- **Thirdweb**: Web3 development platform for wallet connections and blockchain interactions
- **Ethereum**: Primary blockchain network for smart contract interactions

## Database and Backend Services  
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database toolkit with migration support
- **PostgreSQL**: Primary database for user data, sessions, and application state

## UI and Design Libraries
- **Radix UI**: Headless UI components for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development  
- **Framer Motion**: Animation library for smooth user interactions
- **Lucide React**: Icon library with consistent, customizable icons

## Development and Build Tools
- **Vite**: Frontend build tool with hot module replacement and optimization
- **esbuild**: JavaScript/TypeScript bundler for production server builds
- **PostCSS**: CSS processing with Tailwind CSS and autoprefixer plugins

## Form and Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: TypeScript-first schema validation integrated with Drizzle ORM
- **Hookform Resolvers**: Integration layer between React Hook Form and Zod

## Development Environment
- **Replit**: Cloud-based development environment with integrated tooling
- **TypeScript**: Static typing throughout the entire application stack
- **ESM**: Modern ES modules for consistent import/export patterns