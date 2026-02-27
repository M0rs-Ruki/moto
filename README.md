# Moter

A multi-tenant dealership and automotive management application. Manage organizations, visitors, walk-in sessions, digital and field enquiries, delivery tickets, vehicle models, lead sources, and WhatsApp templates — all with role-based access control (RBAC) and organization-level feature toggles.

## Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, Radix UI
- **Backend:** Express.js, TypeScript, Prisma (PostgreSQL)
- **Auth:** JWT, cookie-based sessions, bcrypt
- **Infra:** RabbitMQ (AMQP), Vercel Blob (optional), health checks, rate limiting

## Project Structure 

```
moto/
├── frontend/     # Next.js app (moter-frontend)
├── backend/      # Express API + Prisma (moter-backend)
├── package.json  # Root workspace (pnpm), runs frontend + backend together
└── README.md
```

## Prerequisites

- Node.js 20+
- pnpm (see `packageManager` in root `package.json`)
- PostgreSQL database
- (Optional) RabbitMQ for background jobs / messaging

## Setup

1. **Clone and install**

   ```bash
   git clone <repo-url>
   cd moto
   pnpm install
   ```

2. **Backend environment**

   In `backend/`, create `.env` with at least:

   - `DATABASE_URL` — PostgreSQL connection string
   - `JWT_SECRET` — secret for signing JWTs
   - `CORS_ORIGIN` — frontend origin (e.g. `http://localhost:3000`)
   - Optional: RabbitMQ URL, Vercel Blob token, etc.

3. **Database**

   ```bash
   cd backend
   pnpm run prisma:generate
   pnpm run prisma:dbpush
   ```

4. **Run development**

   From repo root:

   ```bash
   pnpm dev
   ```

   This starts the Next.js frontend (default port 3000) and the Express backend (default port 8000).

## Scripts

| Command | Description |
|--------|-------------|
| `pnpm dev` | Run frontend and backend in development |
| `pnpm backup` | Run backend backup script |
| `pnpm --filter moter-frontend dev` | Frontend only |
| `pnpm --filter moter-backend dev` | Backend only |
| `pnpm --filter moter-backend run prisma:studio` | Open Prisma Studio |

## Security

- **Authentication:** JWT in HTTP-only cookies where applicable; passwords hashed with bcrypt.
- **Authorization:** RBAC (Super Admin, Admin, User) and per-organization isolation; granular permissions for staff users.
- **API:** Security headers and input sanitization middleware; optional rate limiting in production; body size limits (e.g. 10mb).
- **Configuration:** Sensitive values (e.g. `DATABASE_URL`, `JWT_SECRET`) must be provided via environment variables; never commit secrets.

If you discover a security issue, please report it responsibly (e.g. by opening a private issue or contacting the maintainer directly) so it can be addressed before public disclosure.

## License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for the full text.

## Author

**Anup Pradhan** — sole developer and maintainer of this project.
