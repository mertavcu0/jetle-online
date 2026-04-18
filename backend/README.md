# JETLE Backend Migration Skeleton

This backend is a production-ready **technical skeleton** for migrating the current frontend/localStorage marketplace into a real API + database stack without breaking existing UI flows.

## Folder Structure

- `backend/server.js`: app bootstrap, security headers, cors, global middleware
- `backend/config/`: env/db configuration boundary
- `backend/routes/`: endpoint contracts
- `backend/controllers/`: request-response layer
- `backend/services/`: business logic layer
- `backend/middleware/`: auth/guard/validation/error pipeline
- `backend/models/`: data model + index plan
- `backend/utils/`: shared primitives

## Planned API Surface

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Listings
- `GET /api/listings`
- `GET /api/listings/:id`
- `POST /api/listings`
- `PUT /api/listings/:id`
- `PATCH /api/listings/:id/status`
- `DELETE /api/listings/:id`

### User Dashboard
- `GET /api/me/listings`
- `GET /api/me/favorites`
- `GET /api/me/messages`
- `GET /api/me/packages`

### Favorites
- `POST /api/favorites/:listingId`
- `DELETE /api/favorites/:listingId`

### Messages
- `GET /api/messages`
- `GET /api/messages/:conversationId`
- `POST /api/messages`

### Complaints
- `POST /api/complaints`
- `GET /api/complaints/admin`
- `PATCH /api/complaints/admin/:id`

### Admin
- `GET /api/admin/listings`
- `PATCH /api/admin/listings/:id/moderate`
- `PATCH /api/admin/listings/:id/doping`
- `GET /api/admin/users`

### Packages / Doping
- `GET /api/packages`
- `POST /api/packages/activate`
- `POST /api/doping/activate`

## Auth Plan

- Passwords: `argon2id` or `bcrypt` hash (never plain text)
- Recommendation: **JWT access + refresh token pair**
  - Access token short-lived (10-15 min)
  - Refresh token persisted + revocable in `sessions_auth_tokens`
  - Store refresh in httpOnly secure cookie
- Guards:
  - `requireAuth`
  - `requireAdmin`
  - `requireOwnerOrAdmin`

## Media Plan

- Upload route via signed upload or backend proxy
- Validate mime + max-size + extension
- Rename files to generated storage keys
- Store binaries in object storage (S3 compatible)
- Store metadata in `listing_media`

## Doping / Payment Plan

- `packages`: commercial definitions
- `doping_purchases`: activation ledger
- service responsibilities:
  - activate package/doping
  - calculate `featuredUntil/showcaseUntil`
  - expire dopings by scheduled worker (cron/queue)
- payment adapters decoupled in service layer for future provider integration

## Admin Plan

- moderation queue by status `pending`
- complaint triage workflow
- role-based listing and user operations
- action audit log (future: `admin_audit_logs`)

## Deploy Plan

- Runtime: Node LTS + PM2/container
- Reverse proxy: Nginx or platform ingress
- DB: PostgreSQL managed service
- Cache/session/rate limit: Redis
- Storage: S3-compatible bucket + CDN
- CI/CD: lint/test/build + migrations + rolling deploy

## Migration Strategy (No frontend break)

1. keep localStorage flow working
2. introduce API abstraction boundary in frontend
3. move auth + listings read/write to backend
4. move moderation + media upload
5. move messaging + payments/doping activation
