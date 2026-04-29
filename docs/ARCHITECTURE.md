# System Architecture

This document provides a visual overview of the expense tracker application's architecture, showing how different components interact with each other.

![Architecture Diagram](architecture.png)

## Interactive Diagram

```mermaid
graph TD
    classDef frontend fill:#3b82f6,stroke:#1e3a8a,stroke-width:2px,color:#fff
    classDef backend fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff
    classDef database fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff
    classDef external fill:#8b5cf6,stroke:#4c1d95,stroke-width:2px,color:#fff

    subgraph Client ["🖥️ Frontend (React / Vite)"]
        UI[UI Components & Pages]:::frontend
        Cache[TanStack Query Caching]:::frontend
        Router[React Router 7]:::frontend
        UI --- Cache
        UI --- Router
    end

    subgraph Auth ["🔒 Authentication"]
        Clerk[Clerk Auth & User Management]:::external
    end

    subgraph Server ["⚙️ Backend (Node.js / Express)"]
        API[Express REST API]:::backend
        Cron[Node-Cron Scheduler]:::backend
    end

    subgraph DB ["🗄️ Data Layer (Supabase)"]
        Postgres[(PostgreSQL)]:::database
        RLS[Row Level Security]:::database
        WebSockets[Real-time WebSockets]:::database
        Postgres --- RLS
        Postgres --- WebSockets
    end

    subgraph Services ["📧 External Services"]
        Resend[Resend Transactional Email]:::external
    end

    UI -->|1. Login Request| Clerk
    Clerk -->|2. Returns JWT Token| UI
    UI -->|3. REST API + JWT| API
    UI <-->|4. Subscribe to Live Updates| WebSockets
    
    API -->|5. Verify Token| Clerk
    API -->|6. CRUD Operations| Postgres
    API -->|7. Send Invitations/Alerts| Resend
    
    Cron -->|8. Process Daily/Weekly/Monthly| Postgres
```

## Architecture Overview

### Frontend Layer
- **React + Vite**: Modern build tooling and component-based UI
- **TanStack Query**: Server state management and caching
- **React Router 7**: Client-side routing

### Authentication
- **Clerk**: Handles user authentication, session management, and JWT token generation

### Backend Layer
- **Express REST API**: Handles business logic and data operations
- **Node-Cron**: Scheduled tasks for recurring operations (daily/weekly/monthly processing)

### Data Layer
- **Supabase PostgreSQL**: Primary database
- **Row Level Security (RLS)**: Database-level access control
- **Real-time WebSockets**: Live updates for collaborative features

### External Services
- **Resend**: Transactional email delivery for invitations and alerts

## Data Flow

1. User initiates login through the UI
2. Clerk authenticates and returns a JWT token
3. UI makes API requests with the JWT token
4. UI subscribes to real-time updates via WebSockets
5. API verifies tokens with Clerk
6. API performs CRUD operations on PostgreSQL
7. API sends emails via Resend for notifications
8. Cron jobs process scheduled tasks directly against the database
