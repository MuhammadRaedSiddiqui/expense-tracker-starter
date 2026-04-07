-- Fix budgets table by adding missing columns
-- This script adds any missing columns to the existing budgets table

DO $$
BEGIN
  -- Add is_active column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'budgets' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE budgets ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;
  END IF;

  -- Add period column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'budgets' AND column_name = 'period'
  ) THEN
    ALTER TABLE budgets ADD COLUMN period TEXT NOT NULL DEFAULT 'monthly' CHECK (period IN ('monthly', 'yearly'));
  END IF;

  -- Add start_date column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'budgets' AND column_name = 'start_date'
  ) THEN
    ALTER TABLE budgets ADD COLUMN start_date DATE NOT NULL DEFAULT CURRENT_DATE;
  END IF;

  -- Add end_date column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'budgets' AND column_name = 'end_date'
  ) THEN
    ALTER TABLE budgets ADD COLUMN end_date DATE;
  END IF;

  -- Add created_by column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'budgets' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE budgets ADD COLUMN created_by UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'::uuid;
  END IF;

  -- Add updated_by column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'budgets' AND column_name = 'updated_by'
  ) THEN
    ALTER TABLE budgets ADD COLUMN updated_by UUID;
  END IF;

  -- Add created_at column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'budgets' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE budgets ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;

  -- Add updated_at column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'budgets' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE budgets ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Add constraints
DO $$
BEGIN
  -- Add end_date constraint if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'budgets_end_date_check'
  ) THEN
    ALTER TABLE budgets
      ADD CONSTRAINT budgets_end_date_check
      CHECK (end_date IS NULL OR end_date >= start_date);
  END IF;
END $$;

-- Add unique constraint for active budgets
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE indexname = 'idx_budgets_unique_active_category'
  ) THEN
    CREATE UNIQUE INDEX idx_budgets_unique_active_category
      ON budgets(organization_id, category)
      WHERE is_active = true;
  END IF;
END $$;

-- Add other indexes
CREATE INDEX IF NOT EXISTS idx_budgets_org ON budgets(organization_id);
CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category);
CREATE INDEX IF NOT EXISTS idx_budgets_active ON budgets(is_active);

-- Add partial index for period
DROP INDEX IF EXISTS idx_budgets_period;
CREATE INDEX idx_budgets_period ON budgets(start_date, end_date) WHERE is_active = true;

-- Ensure RLS is enabled
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Add updated_at trigger if not exists
DROP TRIGGER IF EXISTS update_budgets_updated_at ON budgets;
CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON budgets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update comment
COMMENT ON TABLE budgets IS 'Stores budget limits by category for tracking spending against targets';
