# Document Management System

## Overview

This is a full-stack document management system built for a Brazilian resale company. The application manages document workflows between administrators and consultants, featuring document creation, status tracking, and file attachments with different workflow states.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with Shadcn/ui components
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **UI Components**: Comprehensive Shadcn/ui component library including DataTable, Button, Input, Card, DropdownMenu, Badge, and AlertDialog

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Replit Auth (OIDC-based) with session management
- **API Design**: RESTful API endpoints for documents, attachments, and user management
- **File Handling**: Multer for multipart file uploads

### Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **File Storage**: Vercel Blob for attachment storage
- **Session Storage**: PostgreSQL-based session store

## Key Components

### Database Schema
1. **Users Table**
   - `id` (varchar, primary key)
   - `email` (varchar, unique)
   - `name`, `firstName`, `lastName`
   - `hashedPassword` (text)
   - `role` (enum: 'ADMIN' or 'CONSULTANT')
   - Profile image URL and timestamps

2. **Documents Table**
   - `id` (uuid, primary key)
   - `title` (text)
   - `status` (enum: 'DELIVERED', 'RECEIPT_CONFIRMED', 'RETURN_SENT', 'COMPLETED')
   - `consultantId` (foreign key to Users)
   - Creation and update timestamps

3. **Attachments Table**
   - `id` (uuid, primary key)
   - `documentId` (foreign key to Documents)
   - `fileName`, `fileUrl` (Vercel Blob URL)
   - `attachmentType` (enum: 'INITIAL' or 'RETURN')
   - Upload timestamp

### Core Workflow Logic
- **Admin Role**: Creates documents, assigns to consultants, confirms returns
- **Consultant Role**: Confirms receipt, submits return documents
- **Status Progression**: DELIVERED → RECEIPT_CONFIRMED → RETURN_SENT → COMPLETED
- **File Management**: Initial attachments from admin, return attachments from consultants

### User Interface Components
- **Admin Dashboard**: Document creation modal, document table with status management, statistics cards
- **Consultant Dashboard**: Document list with receipt confirmation and return submission
- **Shared Components**: Navigation bar, status badges, statistics cards, file upload handling

## Data Flow

1. **Document Creation**: Admin creates document with initial attachments → status set to DELIVERED
2. **Receipt Confirmation**: Consultant confirms receipt → status updates to RECEIPT_CONFIRMED
3. **Return Submission**: Consultant uploads return files → status updates to RETURN_SENT
4. **Completion**: Admin confirms return → status updates to COMPLETED

### Authentication Flow
- Local authentication system with username/password login
- Session-based authentication using PostgreSQL session store
- Role-based access control for admin vs consultant features
- Manual user creation with bcrypt password hashing

## External Dependencies

### Core Technologies
- **React 18+** with TypeScript for frontend
- **Express.js** for backend API server
- **Drizzle ORM** for database operations
- **TanStack Query** for data fetching and caching

### External Services
- **Neon Database** (PostgreSQL serverless)
- **Vercel Blob** for file storage
- **Replit Auth** for authentication

### UI Libraries
- **Radix UI** primitives for accessible components
- **Tailwind CSS** for styling
- **Lucide React** for icons

## Deployment Strategy

### Development Environment
- **Vite Dev Server** for frontend development with HMR
- **tsx** for running TypeScript server directly
- **Development Middleware** for API request logging

### Production Build
- **Frontend**: Vite builds to `dist/public`
- **Backend**: esbuild bundles server to `dist/index.js`
- **Static Serving**: Express serves built frontend assets
- **Database Migrations**: Drizzle Kit for schema management

### Environment Configuration
- Database connection via `DATABASE_URL`
- Session management with `SESSION_SECRET`
- Replit Auth configuration via environment variables
- Vercel Blob storage configuration

## Changelog
- July 01, 2025. Initial setup with Replit Auth
- July 01, 2025. Migrated from Replit Auth to local authentication system:
  - Removed Replit Auth integration and implemented traditional login/password system
  - Updated database schema to support local auth (removed firstName, lastName, profileImageUrl)
  - Created login page with Portuguese interface
  - Implemented logout functionality with proper session management
  - Created user accounts:
    - Admin: admin@company.com (senha: g147g147g147)
    - Consultores: 
      - sergio.bandeira@company.com (senha: 123)
      - mauricio.simoes@company.com (senha: 124)
      - mayco.muniz@company.com (senha: 125)
      - paulo.marcio@company.com (senha: 126)
      - fernando.basil@company.com (senha: 127)

## User Preferences

Preferred communication style: Simple, everyday language.