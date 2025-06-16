# Fullstack Web3 Training Monorepo 🚀

A comprehensive fullstack Web3 training project built with modern technologies and best practices. This monorepo includes a Next.js frontend, NestJS backend API, AWS CDK infrastructure, and shared packages for a complete Web3 application development experience.

## 📋 Prerequisites

Before setting up this project, ensure you have the following installed:

- **Node.js** >= 20.x
- **pnpm** >= 10.4.1 (recommended package manager)
- **Git** for version control
- **AWS CLI** (for infrastructure deployment)
- **Docker** (optional, for database)

## 🏗️ Project Structure

```
├── apps/
│   ├── web/          # Next.js frontend application
│   ├── be/           # NestJS backend API with Prisma
│   └── cdk/          # AWS CDK infrastructure
├── packages/
│   ├── ui/           # Shared UI components (Shadcn/ui)
│   ├── helpers/      # Utility functions and helpers
│   ├── eslint-config/    # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
└── scripts/          # Build and deployment scripts
```

## ⚡ Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd fullstack-web3-training

# Install dependencies for all packages
pnpm install
```

### 2. Environment Setup

Each application requires its own environment configuration:

#### Backend Environment
```bash
# Navigate to backend
cd apps/be

# Create environment files
cp .env.example .env.local
cp .env.example .env.dev

# Configure your environment variables in .env.local and .env.dev
```

#### Frontend Environment
```bash
# Navigate to frontend
cd apps/web

# Create environment file
cp .env.example .env.local

# Configure your environment variables
```

### 3. Database Setup (Backend)

```bash
# From the backend directory (apps/be)
cd apps/be

# Generate Prisma client
pnpm prisma:generate:dev

# Run database migrations
pnpm prisma:migrate:dev

# Seed the database (optional)
pnpm prisma:reset:local
```

### 4. Start Development Servers

From the root directory, you can start all applications:

```bash
# Start all apps in development mode
pnpm dev
```

Or start individual applications:

```bash
# Frontend only (Next.js)
cd apps/web
pnpm dev

# Backend only (NestJS)
cd apps/be
pnpm dev

# Frontend runs on: http://localhost:3000
# Backend API runs on: http://localhost:4000
```

## 🛠️ Available Scripts

### Root Level Commands

```bash
# Development
pnpm dev              # Start all apps in development mode
pnpm build            # Build all packages and apps
pnpm lint             # Lint all packages
pnpm lint:fix         # Fix linting issues
pnpm format           # Format code with Prettier
pnpm type-check       # Type check all TypeScript

# Testing
pnpm test             # Run tests across all packages
```

### Frontend (apps/web)

```bash
pnpm dev              # Start Next.js development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Lint frontend code
pnpm type-check       # Type check frontend
```

### Backend (apps/be)

```bash
pnpm dev              # Start NestJS development server
pnpm build            # Build backend for production
pnpm start:local      # Start with local environment
pnpm test             # Run backend tests

# Database commands
pnpm prisma:generate:dev    # Generate Prisma client
pnpm prisma:migrate:dev     # Run database migrations
pnpm prisma:reset:local     # Reset and seed database
```

### Infrastructure (apps/cdk)

```bash
pnpm build            # Build CDK application
pnpm cdk              # Run AWS CDK commands
pnpm bootstrap:dev    # Bootstrap CDK for development
pnpm deploy:dev:local # Deploy to development environment
```

## 🎨 UI Components

This project uses **Shadcn/ui** for consistent, accessible UI components.

### Adding New Components

```bash
# Add a new Shadcn component to the UI package
pnpm dlx shadcn@latest add button -c apps/web
```

### Using Components

```tsx
// Import from the shared UI package
import { Button, Card, Input } from "@workspace/ui/components/ui"

// Use in your components
export function MyComponent() {
  return (
    <Card className="p-6">
      <Input placeholder="Enter text..." />
      <Button>Submit</Button>
    </Card>
  )
}
```

## 🏛️ Architecture & Tech Stack

### Frontend (apps/web)
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS + Shadcn/ui
- **State Management**: Zustand + React Query
- **Forms**: React Hook Form + Zod

### Backend (apps/be)
- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + Passport
- **API Documentation**: Swagger/OpenAPI
- **Deployment**: AWS Lambda (Serverless)

### Infrastructure (apps/cdk)
- **Platform**: AWS CDK (TypeScript)
- **Deployment**: Serverless architecture
- **Services**: Lambda, RDS, API Gateway, CloudFront

### Shared Packages
- **@workspace/ui**: Shadcn/ui components and custom UI
- **@workspace/helpers**: Utility functions and helpers
- **@workspace/eslint-config**: Shared linting rules
- **@workspace/typescript-config**: Shared TypeScript configuration

## 🗄️ Database Management

### Local Development

```bash
# Reset database and apply all migrations
pnpm prisma:reset:local

# Create and apply new migration
pnpm prisma:migrate:dev

# Open Prisma Studio (Database GUI)
pnpm prisma studio
```

### Environment-Specific Commands

```bash
# Development environment
pnpm prisma:migrate:dev
pnpm prisma:reset:dev

# Staging environment
pnpm prisma:migrate:spec
pnpm prisma:reset:spec
```

## 🚀 Deployment

### Backend Deployment

```bash
# Build and deploy backend to AWS
cd apps/be
pnpm build

cd ../cdk
pnpm deploy:dev:quick
```

### Frontend Deployment

```bash
# Build frontend for production
cd apps/web
pnpm build

# Deploy to your hosting platform (Vercel, Netlify, etc.)
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Backend tests
cd apps/be
pnpm test
pnpm test:watch
pnpm test:cov

# Frontend tests (when configured)
cd apps/web
pnpm test
```

## 📚 Development Guidelines

### Code Quality
- **ESLint**: Enforced across all packages
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking
- **Husky**: Pre-commit hooks for quality assurance

### Commit Convention
This project follows conventional commits:
```bash
feat: add new user authentication
fix: resolve database connection issue
docs: update setup instructions
```

### Adding New Packages

```bash
# Create a new package in the packages/ directory
mkdir packages/new-package
cd packages/new-package

# Initialize with package.json
pnpm init

# Add to pnpm-workspace.yaml if needed
```

## 🆘 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000 (frontend) and 4000 (backend) are available
2. **Database connection**: Verify PostgreSQL is running and environment variables are correct
3. **Dependencies**: Run `pnpm install` from the root if packages are missing
4. **Prisma issues**: Run `pnpm prisma:generate:dev` after schema changes

### Getting Help

- Check the logs in your terminal for detailed error messages
- Ensure all environment variables are properly configured
- Verify that all prerequisites are installed with correct versions

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Make your changes following the project conventions
3. Run tests and linting: `pnpm lint && pnpm test`
4. Commit using conventional commits
5. Push to your branch and create a Pull Request

## 📄 License

This project is for educational purposes as part of the Fullstack Web3 Training program.

---

Ready to build amazing Web3 applications! 🌟
