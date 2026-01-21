# Task Manager - Frontend Client

A modern, performant Next.js 15 frontend application for collaborative task management. Built with the App Router, TypeScript, and optimized for real-time collaboration.

## 🚀 Features

- **Modern UI/UX**: Responsive design with Shadcn/ui components and Tailwind CSS
- **Real-time Updates**: Socket.io integration for instant task synchronization
- **Optimistic UI**: Immediate feedback on user actions with background server sync
- **Dark Mode**: Full theme support with next-themes
- **Type-Safe Forms**: React Hook Form with Zod validation
- **Efficient State Management**: TanStack Query for server state caching and synchronization
- **Authentication**: Secure JWT-based auth with HTTP-only cookies and refresh token rotation

## 🛠 Tech Stack

| Category             | Technology       | Purpose                         |
| -------------------- | ---------------- | ------------------------------- |
| **Framework**        | Next.js 15       | React framework with App Router |
| **Language**         | TypeScript       | Type safety                     |
| **Styling**          | Tailwind CSS     | Utility-first CSS               |
| **UI Components**    | Shadcn/ui        | Accessible component library    |
| **State Management** | TanStack Query   | Server state & caching          |
| **Forms**            | React Hook Form  | Form management                 |
| **Validation**       | Zod              | Schema validation               |
| **Theme**            | next-themes      | Dark/light mode                 |
| **Real-time**        | Socket.io Client | WebSocket communication         |

## ⚡ Performance Optimizations

- **TanStack Query**: Intelligent caching, background refetching, and optimistic updates
- **Code Splitting**: Automatic route-based code splitting via Next.js
- **Dynamic Imports**: Lazy loading for heavy components (forms, dialogs)
- **Image Optimization**: Next.js Image component with automatic optimization
- **Font Optimization**: Automatic font optimization with `next/font`
- **Client-Side Auth**: Non-blocking authentication validation for faster page loads

## 📂 Project Structure

```
client/
├── app/                        # Next.js App Router
│   ├── dashboard/              # Dashboard page
│   ├── register/               # Registration page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Login page (root)
│   └── globals.css             # Global styles
│
├── components/                 # React components
│   ├── dashboard/              # Dashboard-specific components
│   │   ├── create-task-dialog.tsx
│   │   ├── edit-task-dialog.tsx
│   │   └── all-tasks-dialog.tsx
│   ├── forms/                  # Form components
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── ui/                     # Shadcn/ui components
│
├── hooks/                      # Custom React hooks
│   ├── useAuth.ts              # Authentication hooks
│   ├── useTasks.ts             # Task management hooks
│   └── useUsers.ts             # User search hooks
│
├── lib/                        # Utilities
│   ├── api.ts                  # Axios instance with interceptors
│   └── utils.ts                # Helper functions
│
├── services/                   # API service layer
│   ├── auth.service.ts         # Auth API calls
│   └── task.service.ts         # Task API calls
│
├── schemas/                    # Zod validation schemas
│   ├── loginSchema.ts
│   ├── registerSchema.ts
│   └── taskSchemas.ts
│
├── types/                      # TypeScript types
│   ├── auth.type.ts
│   ├── task.ts
│   └── user.ts
│
├── integrations/               # Third-party integrations
│   ├── tanstack-query/         # React Query setup
│   └── theme-provider.tsx      # Theme provider
│
├── proxy.ts                    # Next.js proxy/middleware
├── next.config.ts              # Next.js configuration
└── Dockerfile                  # Docker configuration

```

## 🏁 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm (recommended) or npm

### Installation

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up environment variables**
   
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1/development
   ```

3. **Run the development server**
   ```bash
   pnpm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
# Development server
pnpm run dev

# Production build
pnpm run build

# Start production server
pnpm start

# Type checking
pnpm run type-check

# Linting
pnpm run lint
```

## 🔐 Authentication Flow

The application uses a robust JWT-based authentication system:

1. **Login/Register**: User credentials are sent to the server
2. **Token Storage**: Access token (15m) and refresh token (7d) stored in HTTP-only cookies
3. **Auto-Refresh**: Expired access tokens are automatically refreshed using the refresh token
4. **Session Management**: Refresh token expiry triggers automatic logout
5. **Protected Routes**: `useRequireAuth()` hook protects authenticated pages
6. **Public Routes**: `useRedirectIfAuthenticated()` redirects logged-in users from login/register

## 🎨 UI Components

The application uses [Shadcn/ui](https://ui.shadcn.com/) components:

- **Forms**: Input, Textarea, Select, Calendar
- **Feedback**: Toast notifications, Loading states
- **Overlays**: Dialog, Popover, Command palette
- **Layout**: Card, Separator, Avatar
- **Navigation**: Button, Link

All components are fully accessible and customizable via Tailwind CSS.

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t task-manager-client .
```

### Run Container

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=http://your-api-url \
  task-manager-client
```

### Docker Compose

See the root `docker-compose.yaml` for full stack deployment.

## 🔧 Configuration

### Next.js Config

The `next.config.ts` includes:
- **Standalone Output**: Optimized for Docker deployment
- **API Rewrites**: Proxy `/api/*` requests to the backend server

### Proxy Configuration

The `proxy.ts` file handles:
- Route protection (currently disabled, handled client-side)
- Request forwarding to the backend

## 📖 Key Hooks

### Authentication Hooks

```typescript
// Main auth hook
const { user, isAuthenticated, isLoading } = useAuth()

// Protect routes
useRequireAuth() // Redirects to login if not authenticated

// Redirect authenticated users
useRedirectIfAuthenticated('/dashboard') // Redirects to dashboard if logged in

// Auth mutations
const { mutate: login } = useLogin()
const { mutate: register } = useRegister()
const { mutate: logout } = useLogout()
```

### Task Hooks

```typescript
// Fetch tasks
const { data: tasks, isLoading } = useGetTasks()

// Create task
const { mutate: createTask } = useCreateTask()

// Update task
const { mutate: updateTask } = useUpdateTask()

// Delete task
const { mutate: deleteTask } = useDeleteTask()
```

## 🎯 Best Practices

1. **Type Safety**: All API responses and forms are fully typed
2. **Error Handling**: Comprehensive error handling with user-friendly messages
3. **Loading States**: Skeleton loaders and spinners for better UX
4. **Optimistic Updates**: UI updates immediately before server confirmation
5. **Accessibility**: ARIA labels and keyboard navigation support
6. **Responsive Design**: Mobile-first approach with breakpoint utilities

## 🚀 Performance Tips

- Use `dynamic()` for code splitting heavy components
- Implement proper loading and error states
- Leverage TanStack Query's caching strategies
- Use `next/image` for automatic image optimization
- Minimize client-side JavaScript with Server Components where possible

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT © Amit Parmar

---

For the complete project documentation, see the [root README](../README.md).

For backend documentation, see the [server README](../server/README.md).
