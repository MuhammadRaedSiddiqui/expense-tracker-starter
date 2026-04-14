-- Add idempotency key to transactions table
-- This prevents duplicate transaction creation from double-clicks or network retries

ALTER TABLE transactions
ADD COLUMN idempotency_key UUID;

-- Create unique index on idempotency_key to enforce uniqueness
-- Partial index only on non-null values (allows null for existing records)
CREATE UNIQUE INDEX transactions_idempotency_key_idx
ON transactions (idempotency_key)
WHERE idempotency_key IS NOT NULL;

-- Add comment explaining the column
COMMENT ON COLUMN transactions.idempotency_key IS
'Unique key to prevent duplicate transaction creation. Generated client-side using crypto.randomUUID()';
