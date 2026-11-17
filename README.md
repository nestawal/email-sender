# Email Sender

A backend service for creating and sending bulk email campaigns asynchronously.

# Tech Stack
- Node.js / TypeScript
- Express
- PostgreSQL (Database)
- Redis (Queue broker)
- BullMQ (Job queue)
- Nodemailer (SMTP delivery)
- JWT & Bcrypt (Authentication)
- Docker & Docker Compose

# Architecture

The system separates the HTTP request layer from the email delivery layer using a queue.

1. **API Layer:** Express handles incoming HTTP requests, validates JWTs, and manages database records via controllers and services.
2. **Producer:** When a campaign is sent, the service validates the request and pushes a job containing the campaignId to a BullMQ queue backed by Redis.
3. **Worker Layer:** A separate background worker process consumes jobs from the queue.
4. **Delivery:** The worker retrieves the campaign from the database, updates its status, loops through recipients, and dispatches emails via Nodemailer using SMTP.
5. **State Management:** The database tracks campaign statuses (draft, queued, sending, sent, failed).

# Project Structure

- controllers/ : HTTP request/response handling
- interfaces/ : TypeScript interfaces (e.g., EmailProvider)
- middleware/ : Express middleware (JWT auth)
- providers/ : Third-party integrations (NodeMailerAdapter)
- queues/ : BullMQ queue definitions
- repos/ : Database queries (SQL)
- routes/ : Express route definitions
- scripts/ : Migration and utility scripts
- services/ : Business logic
- sql/ : SQL schema and migration files
- workers/ : BullMQ consumer processes
- index.ts : Application entry point
- Dockerfile : Docker configuration for the app
- docker-compose.yml : Docker Compose for App, DB, and Redis
- .env.example : Example environment variables
- README.md : Project documentation

# Environment Variables

Copy .env.example to .env and fill in the values. 

Note for Docker: If you are running this via Docker Compose, ensure DATABASE_URL uses @db:5432 and REDIS_HOST=redis. If running locally without Docker, use @localhost:5432 and REDIS_HOST=localhost.

PORT=3000
DATABASE_URL=postgresql://postgres:postgres@db:5432/email_sender
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=your_secure_random_string
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_username
SMTP_PASS=your_mailtrap_password
EMAIL_FROM=no-reply@yourapp.com

# Setup and Installation

## Option 1: Using Docker (Recommended)
1. Ensure Docker Desktop is running.
2. Start the containers: docker compose up -d --build
3. Run the database migrations inside the container: docker compose exec app npm run db:migrate
4. The API is now running at http://localhost:3000.

## Option 2: Local Development (Without Docker)
1. Install dependencies: npm install
2. Ensure PostgreSQL and Redis are running locally on your machine.
3. Run the database migrations: npm run db:migrate
4. Start the application: npm run dev

# API Endpoints

## Authentication

### Register a new user
POST /api/v1/users/register
Body: { "name": "Alice", "email": "alice@example.com", "password": "secret123" }

### Login
POST /api/v1/users/login
Body: { "email": "alice@example.com", "password": "secret123" }
Response: Returns a token. Include this in the header Authorization: Bearer <token> for all campaign routes.

## Campaigns

All campaign routes require the Authorization: Bearer <token> header.

### Create a Campaign Draft
POST /api/v1/campaign
Body: { "sender": "sender@example.com", "title": "Campaign Subject", "email": "<h1>HTML Content</h1>", "recipients": ["user1@example.com", "user2@example.com"] }
Response: 201 Created with the campaign object (status: draft).

### Update a Campaign Draft
PATCH /api/v1/campaign/:id
Body: Include any fields to update (title, email, recipients).

### Delete a Campaign Draft
DELETE /api/v1/campaign/:id

### Send a Campaign
POST /api/v1/campaign/:id/send
Response: 202 Accepted. Triggers the background worker to process and send the emails.