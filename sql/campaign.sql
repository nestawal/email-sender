CREATE TABLE IF NOT EXISTS campaign(
    id SERIAL PRIMARY KEY,
    sender VARCHAR(255) NOT NULL,
    title TEXT NOT NULL,
    email TEXT NOT NULL,
    recipients VARCHAR(255)[],
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'queued', 'sending', 'sent', 'failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)