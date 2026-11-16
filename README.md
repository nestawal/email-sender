# Email Sender

A backend service for creating and sending bulk email campaigns asynchronously.

## Tech Stack
- Node.js / TypeScript
- Express
- PostgreSQL (Database)
- Redis (Queue broker)
- BullMQ (Job queue)
- Nodemailer (SMTP delivery)
- JWT & Bcrypt (Authentication)

## Architecture

The system separates the HTTP request layer from the email delivery layer using a queue.

1. **API Layer:** Express handles incoming HTTP requests, validates JWTs, and manages database records via controllers and services.
2. **Producer:** When a campaign is sent, the service validates the request and pushes a job containing the `campaignId` to a BullMQ queue backed by Redis.
3. **Worker Layer:** A separate background worker process consumes jobs from the queue.
4. **Delivery:** The worker retrieves the campaign from the database, updates its status, loops through recipients, and dispatches emails via Nodemailer using SMTP.
5. **State Management:** The database tracks campaign statuses (`draft`, `queued`, `sending`, `sent`, `failed`).

## Project Structure

```text
├── controllers/    # HTTP request/response handling
├── interfaces/     # TypeScript interfaces (e.g., EmailProvider)
├── middleware/     # Express middleware (JWT auth)
├── providers/      # Third-party integrations (NodeMailerAdapter)
├── queues/         # BullMQ queue definitions
├── repos/          # Database queries (SQL)
├── routes/         # Express route definitions
├── scripts/        # Migration and utility scripts
├── services/       # Business logic
├── sql/            # SQL schema and migration files
├── workers/        # BullMQ consumer processes
├── index.ts        # Application entry point
└── .env            # Environment variables (not committed)