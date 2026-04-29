# Glossary

This glossary defines technical terms and concepts used throughout the expense tracker documentation.

## A

**API (Application Programming Interface)**
A set of rules and protocols that allows different software applications to communicate with each other. In this project, the backend exposes a REST API that the frontend consumes.

**Authentication**
The process of verifying the identity of a user. This project uses Clerk for authentication, which provides JWT-based authentication.

**Authorization**
The process of determining what actions an authenticated user is allowed to perform. This project uses role-based access control (RBAC) with roles like owner, admin, and member.

**Audit Log**
A record of actions performed in the system, including who performed the action, when, and what was changed. Used for compliance and debugging.

## B

**Backend**
The server-side part of the application that handles business logic, database operations, and API endpoints. Built with Node.js and Express.

**Budget**
A spending limit set for a specific category and time period (usually monthly). Users can track spending against budgets and receive alerts.

**Bundle**
The compiled and optimized JavaScript files that are served to the browser. Smaller bundles load faster.

## C

**Cache**
Temporary storage of data to improve performance. This project uses TanStack Query for client-side caching and can use Redis for server-side caching.

**Category**
A classification for transactions (e.g., Food, Transportation, Utilities). Used for organizing and analyzing spending.

**Clerk**
A third-party authentication service that handles user sign-up, sign-in, session management, and JWT token generation.

**CORS (Cross-Origin Resource Sharing)**
A security feature that controls which domains can access your API. Configured to allow requests from the frontend domain.

**CRUD (Create, Read, Update, Delete)**
The four basic operations for managing data. Most API endpoints implement CRUD operations.

**Currency**
The monetary unit used for transactions. This project supports multiple currencies with real-time exchange rate conversion.

## D

**Database**
The persistent storage system for application data. This project uses Supabase PostgreSQL.

**Deployment**
The process of making the application available to users, typically by hosting it on a server or cloud platform.

**Development Environment**
The local setup where developers write and test code before deploying to production.

## E

**E2E (End-to-End) Testing**
Testing that simulates real user scenarios from start to finish. Uses Playwright to test complete workflows.

**Environment Variables**
Configuration values stored outside the code (in `.env` files) for security and flexibility. Examples: API keys, database URLs.

**Express**
A minimal and flexible Node.js web application framework used for building the backend API.

## F

**Frontend**
The client-side part of the application that users interact with. Built with React and Vite.

**Frankfurter API**
A free API that provides real-time currency exchange rates, used for multi-currency conversion.

## H

**Hook (React)**
A function that lets you use React features like state and lifecycle methods in functional components. Examples: useState, useEffect, useQuery.

**HTTP (Hypertext Transfer Protocol)**
The protocol used for communication between the frontend and backend. HTTPS is the secure version.

## I

**Integration Testing**
Testing that verifies multiple components or systems work together correctly.

**Invitation**
A mechanism for adding new members to an organization. Invitations are sent via email and expire after a set time.

## J

**JWT (JSON Web Token)**
A compact, URL-safe token format used for authentication. Contains encoded user information and is signed to prevent tampering.

## L

**localStorage**
Browser storage that persists data even after the browser is closed. The v0.x version used localStorage; v1.0+ uses a database.

## M

**Migration**
1. Database migration: A script that modifies the database schema (adding tables, columns, indexes).
2. Data migration: Moving data from one system to another (e.g., from localStorage to database).

**Mutation**
In TanStack Query, an operation that modifies data (create, update, delete). Contrasts with queries, which only read data.

## N

**Node.js**
A JavaScript runtime that allows running JavaScript on the server. Used for the backend.

**Notification**
An alert sent to users about important events (budget exceeded, invitation received, etc.). Can be in-app or via email.

## O

**Organization**
A group or team that shares access to transactions, budgets, and other data. Users can belong to multiple organizations.

**Optimistic Update**
Updating the UI immediately before the server confirms the change, making the app feel faster. Rolled back if the server request fails.

## P

**Pagination**
Splitting large result sets into smaller pages to improve performance and user experience.

**PostHog**
An analytics platform used to track user behavior and product usage.

**PostgreSQL**
An open-source relational database system. Used via Supabase in this project.

**Production**
The live environment where real users access the application. Contrasts with development and staging environments.

## Q

**Query**
1. Database query: A request to retrieve or modify data in the database.
2. TanStack Query: A library for fetching, caching, and updating data in React applications.

## R

**Rate Limiting**
Restricting the number of API requests a user can make in a given time period to prevent abuse.

**React**
A JavaScript library for building user interfaces using components.

**Real-time**
Features that update immediately without requiring a page refresh. Implemented using WebSockets via Supabase.

**Recurring Transaction**
A transaction that repeats on a schedule (daily, weekly, monthly, yearly). Automatically created by scheduled tasks.

**Resend**
A transactional email service used to send invitation emails and notifications.

**REST (Representational State Transfer)**
An architectural style for APIs that uses HTTP methods (GET, POST, PATCH, DELETE) to perform operations.

**RLS (Row Level Security)**
A PostgreSQL feature that restricts which rows users can access based on policies. Ensures users only see their organization's data.

**Role**
A set of permissions assigned to a user within an organization. Roles: owner (full control), admin (manage members and settings), member (basic access).

## S

**Sentry**
An error tracking and monitoring platform that captures and reports application errors.

**Supabase**
An open-source Firebase alternative that provides PostgreSQL database, authentication, real-time subscriptions, and storage.

**Staging**
An environment that mirrors production, used for final testing before deploying to production.

## T

**TanStack Query**
A data fetching and caching library for React (formerly React Query). Handles server state management.

**Transaction**
A financial record of income or expense, including amount, category, date, and description.

**TypeScript**
A typed superset of JavaScript that adds static type checking. (Optional in this project)

## U

**Unit Testing**
Testing individual functions or components in isolation to verify they work correctly.

**UUID (Universally Unique Identifier)**
A 128-bit identifier that is unique across space and time. Used as primary keys in the database.

## V

**Vite**
A fast build tool and development server for modern web projects. Used for the frontend.

**Virtual Scrolling**
A technique for efficiently rendering large lists by only rendering visible items.

## W

**WebSocket**
A protocol for real-time, bidirectional communication between client and server. Used by Supabase for real-time updates.

**Webhook**
An HTTP callback that notifies your application when an event occurs in a third-party service. Example: Clerk sends webhooks when users are created.

## Acronyms

| Acronym | Full Form |
|---------|-----------|
| API | Application Programming Interface |
| CORS | Cross-Origin Resource Sharing |
| CRUD | Create, Read, Update, Delete |
| E2E | End-to-End |
| HTTP | Hypertext Transfer Protocol |
| HTTPS | HTTP Secure |
| JWT | JSON Web Token |
| RLS | Row Level Security |
| REST | Representational State Transfer |
| UI | User Interface |
| UX | User Experience |
| UUID | Universally Unique Identifier |

---

Last updated: 2026-04-29
