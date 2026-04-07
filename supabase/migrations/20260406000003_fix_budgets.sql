-- Fix budgets table by adding missing indexes and constraints
-- This script is safe to run even if some elements already exist

-- Add unique constraint for active budgets (if not exists)
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

-- Add other indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_budgets_org ON budgets(organization_id);
CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category);
CREATE INDEX IF NOT EXISTS idx_budgets_active ON budgets(is_active);

-- Add partial index for period (drop and recreate since we can't use IF NOT EXISTS with WHERE clause)
DROP INDEX IF EXISTS idx_budgets_period;
CREATE INDEX idx_budgets_period ON budgets(start_date, end_date) WHERE is_active = true;

-- Ensure RLS is enabled
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Update comment
COMMENT ON TABLE budgets IS 'Stores budget limits by category for tracking spending against targets';
