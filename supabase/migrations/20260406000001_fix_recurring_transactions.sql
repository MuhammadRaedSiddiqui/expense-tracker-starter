-- Fix recurring_transactions table by adding missing columns
-- This script is safe to run multiple times

-- Add missing columns if they don't exist
DO $$
BEGIN
  -- Add next_execution_date if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recurring_transactions'
    AND column_name = 'next_execution_date'
  ) THEN
    ALTER TABLE recurring_transactions ADD COLUMN next_execution_date DATE NOT NULL DEFAULT CURRENT_DATE;
  END IF;

  -- Add last_execution_date if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recurring_transactions'
    AND column_name = 'last_execution_date'
  ) THEN
    ALTER TABLE recurring_transactions ADD COLUMN last_execution_date DATE;
  END IF;

  -- Add is_active if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recurring_transactions'
    AND column_name = 'is_active'
  ) THEN
    ALTER TABLE recurring_transactions ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;
  END IF;

  -- Add frequency if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recurring_transactions'
    AND column_name = 'frequency'
  ) THEN
    ALTER TABLE recurring_transactions ADD COLUMN frequency TEXT NOT NULL DEFAULT 'monthly' CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly'));
  END IF;

  -- Add interval if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recurring_transactions'
    AND column_name = 'interval'
  ) THEN
    ALTER TABLE recurring_transactions ADD COLUMN interval INTEGER NOT NULL DEFAULT 1 CHECK (interval > 0);
  END IF;

  -- Add start_date if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recurring_transactions'
    AND column_name = 'start_date'
  ) THEN
    ALTER TABLE recurring_transactions ADD COLUMN start_date DATE NOT NULL DEFAULT CURRENT_DATE;
  END IF;

  -- Add end_date if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recurring_transactions'
    AND column_name = 'end_date'
  ) THEN
    ALTER TABLE recurring_transactions ADD COLUMN end_date DATE;
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_next_execution
  ON recurring_transactions(next_execution_date) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_recurring_transactions_active
  ON recurring_transactions(is_active);

-- Add table constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'recurring_transactions_end_date_check'
  ) THEN
    ALTER TABLE recurring_transactions
      ADD CONSTRAINT recurring_transactions_end_date_check
      CHECK (end_date IS NULL OR end_date >= start_date);
  END IF;
END $$;

-- Update comment
COMMENT ON TABLE recurring_transactions IS 'Stores recurring transaction templates that automatically create transactions on schedule';
