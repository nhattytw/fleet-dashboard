# FleetOS Engineering Dashboard

A high-fidelity Fleet Management System built with a focus on real-time data integrity, strict type safety, and minimalistic UX.

## System Architecture

Built using a **Layered Service-Oriented Architecture**:

- **API Layer (Node.js/Express):** Decouples HTTP concerns from business logic.
- **Service Layer:** Encapsulates Prisma ORM transactions and socket events.
- **Real-time Gateway (Socket.io):** Provides Bi-directional state sync between PostgreSQL and Client.
- **Client Layer (React 19/TanStack):** Uses headless UI implementation for high-performance data manipulation

## Tech Stack

- **Runtime:** Node.js v24 LTS
- **Database:** PostgreSQL 18.1 (Dockerized)
- **ORM:** Prisma v5.22
- **UI:** React 19, Tailwind CSS v4, Shadcn Primitives
- **State:** TanStack Query v5 (Server-state), TanStack Table v8

## Installation & Setup

### 1. Database Infrastructure

Spin up the persistent storage layer:

```bash
docker-compose up -d
```

### 2. Backend Bootstrapping

Install dependencies and synchronize the schema:

```bash
cd server
npm install
npm run db:push
npm run prisma:seed
npm run dev
```

### 3. Frontend Implementation

Launch the Vite development server:

```bash
cd client
npm install
npm run dev
```

## Requirement Compliance Checklist

- [x] **Theme:** Monochrome professional Zinc palette.
- [x] **Sockets:** Real-time counter updates on `total`, `active`, and `maintenance`.
- [x] **CRUD:** Full state mutation (Create, Patch, Soft-Delete) for fleet units.
- [x] **Command Center:** Persistent footer CLI for asynchronous admin requests to the server console.
- [x] **Data Logic:** Advanced sorting (Date/Number/String), global search, and CSV reporting.

## Engineering Best Practices Used

- **Strict TypeScript:** Zero usage of `any`. Explicit interface sharing across the boundary (Backend ↔ Frontend).
- **React 19 Purity:** Idempotent rendering via `useMemo` for temporal logic.
- **Singleton Persistence:** Centralized Prisma and Socket instance management.
- **Separation of Concerns (SOC):** Strict decoupling of HTTP concerns (Controllers), Business Logic (Services), and Data Access (Prisma).
- **Singleton Pattern & Dependency Persistence:** Database (Prisma) and Real-time (Socket.io) instances are managed as singletons.
