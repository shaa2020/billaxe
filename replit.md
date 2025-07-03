# Professional Invoice Maker Pro

## Overview

This is a full-stack invoice generation application built with a modern tech stack. The application allows users to create professional invoices with customizable branding, manage templates, and generate PDF outputs. It features a React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration via Drizzle ORM.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: React hooks with TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Theme**: Dark/light mode support with system preference detection

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **API Pattern**: RESTful endpoints with JSON responses
- **Development**: Hot reload with Vite middleware integration

### Key Components

#### Database Schema
- **Invoices Table**: Stores complete invoice information including company details, billing information, dates, and totals
- **Invoice Items Table**: Stores line items with descriptions, quantities, rates, VAT, and calculated totals
- **Templates Table**: Stores reusable invoice templates with company information
- **Template Items Table**: Stores template line items without calculated totals

#### Core Features
1. **Invoice Management**: Create, edit, view, and delete invoices
2. **Template System**: Save invoice configurations as templates for reuse
3. **PDF Generation**: Client-side PDF generation using html2pdf.js
4. **Responsive Design**: Mobile-first approach with adaptive layouts
5. **Theme Support**: Light/dark mode with persistent user preferences

#### UI Components
- **Invoice Header**: Company branding with logo upload capability
- **Invoice Form**: Comprehensive form for billing details and invoice metadata
- **Items Table**: Dynamic table for managing invoice line items with real-time calculations
- **Template Modal**: Interface for saving and loading invoice templates
- **Invoice Totals**: Automatic calculation of subtotals, VAT, and grand totals

## Data Flow

1. **Invoice Creation**: User fills out invoice form → Data validated → Sent to backend API → Stored in PostgreSQL
2. **Template Usage**: User selects template → Template data loaded → Pre-fills invoice form → User can modify and save
3. **PDF Generation**: User clicks download → Invoice HTML captured → html2pdf.js processes → PDF file generated client-side
4. **Real-time Calculations**: Item changes → JavaScript calculations → UI updates immediately → No server round-trip needed

## External Dependencies

### Frontend Dependencies
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI component primitives
- **html2pdf.js**: Client-side PDF generation from HTML
- **wouter**: Lightweight routing library
- **tailwindcss**: Utility-first CSS framework
- **date-fns**: Date manipulation utilities

### Backend Dependencies
- **drizzle-orm**: Type-safe SQL query builder
- **@neondatabase/serverless**: Neon PostgreSQL driver
- **express**: Web application framework
- **zod**: Schema validation
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Static type checking
- **drizzle-kit**: Database migration and introspection
- **esbuild**: JavaScript bundler for production builds

## Deployment Strategy

### Development Environment
- Vite development server with HMR (Hot Module Replacement)
- Express server with automatic restart via tsx
- Database migrations handled by Drizzle Kit
- Environment variables for database connection

### Production Build Process
1. **Frontend**: Vite builds React application to `dist/public`
2. **Backend**: esbuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle pushes schema changes to production database
4. **Serving**: Express serves both API routes and static frontend files

### Database Management
- **Schema Definition**: Centralized in `shared/schema.ts`
- **Migrations**: Generated and applied via `drizzle-kit`
- **Connection**: Environment-based configuration with `DATABASE_URL`
- **Provider**: Neon serverless PostgreSQL for scalability

## Changelog

- July 03, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.