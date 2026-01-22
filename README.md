# Collaborative Task Manager

A production-grade, full-stack task management application designed for real-time collaboration, performance, and scalability. This monorepo contains both the client and server applications.

## 🚀 Key Features

*   **Real-time Collaboration**: Instant updates on tasks, status, and assignments using Socket.io.
*   **Secure Authentication**: Robust JWT-based auth with HTTP-only cookies, refresh token rotation, and secure session management.
*   **Fluid UI/UX**: Responsive design with smooth transitions, dark mode support, and optimistic UI updates for a native-app feel.
*   **Task Management**: Comprehensive CRUD operations, filtering, sorting, and assignee management.

## ⚡ Performance & Optimization Strategies

We prioritized performance and user experience through modern architectural patterns:

*   **TanStack Query (React Query)**: Utilized for efficient server state management, caching, background refetching, and optimistic updates to ensure the UI feels instant.
*   **Client-Side Auth Validation**: Implemented a non-blocking authentication flow that validates tokens client-side for faster initial page loads while maintaining security.
*   **Optimistic UI**: Interface updates immediately upon user action (like creating a task) while the server processes the request in the background.
*   **Code Splitting & Lazy Loading**: Next.js automatic code splitting and dynamic imports for heavy components (e.g., charts, modals) to minimize initial bundle size.
*   **Fluid Responsive Design**: Mobile-first approach using Tailwind CSS ensuring a consistent experience across all devices.
*   **Efficient Backend**: Repository-Service-Controller pattern with Prisma ORM and minimal database queries.

## 🛠 Tech Stack

### [Client Application](./client/README.md)
*   **Framework**: Next.js 15 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS, Shadcn/ui
*   **State Management**: TanStack Query (React Query)
*   **Forms**: React Hook Form + Zod

### [Server Application](./server/README.md)
*   **Runtime**: Node.js + Express
*   **Language**: TypeScript
*   **Database**: PostgreSQL
*   **ORM**: Prisma
*   **Real-time**: Socket.io
*   **Auth**: JWT (Access + Refresh Tokens)

## 📂 Project Structure

```bash
task-manager/
├── client/                 # Next.js Frontend Application
│   ├── app/                # App Router pages and layouts
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks (auth, tasks, etc.)
│   └── lib/                # Utilities and API configurations
│
├── server/                 # Express Backend API
│   ├── src/
│   │   ├── modules/        # Feature-based functionality (Auth, Tasks)
│   │   ├── middlewares/    # Custom middlewares (Auth, Error handling)
│   │   └── prisma/         # Database schema and migrations
│   └── tests/              # Unit and Integration tests
│
└── docker-compose.yaml     # Container orchestration
```

## 🏁 Getting Started

To get the full application running locally:

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd task-manager
    ```

2.  **Install Dependencies**
    ```bash
    # Install server dependencies
    cd server
    pnpm install

    # Install client dependencies
    cd ../client
    pnpm install
    ```

3.  **Environment Setup**
    *   Navigate to `server/` and create a `.env` file (see `server/.env.example`)
    *   Navigate to `client/` and create a `.env.local` file (see `client/.env.example`)

4.  **Run Development Servers**
    *   **Server**: `cd server && pnpm run dev` (Runs on port 8000)
    *   **Client**: `cd client && pnpm run dev` (Runs on port 3000)

For detailed documentation, please refer to the specific project READMEs:

*   📘 **[Client Documentation](./client/README.md)**
*   📗 **[Server Documentation](./server/README.md)**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © Amit Parmar
