-- Create budgets table
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Budget details
  category TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  period TEXT NOT NULL CHECK (period IN ('monthly', 'yearly')),

  -- Date range
  start_date DATE NOT NULL,
  end_date DATE, -- NULL means ongoing/recurring

  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Metadata
  created_by UUID NOT NULL,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Create indexes for efficient querying
CREATE INDEX idx_budgets_org ON budgets(organization_id);
CREATE INDEX idx_budgets_category ON budgets(category);
CREATE INDEX idx_budgets_active ON budgets(is_active);
CREATE INDEX idx_budgets_period ON budgets(start_date, end_date) WHERE is_active = true;

-- Unique constraint: one active budget per category per organization
CREATE UNIQUE INDEX idx_budgets_unique_active_category
  ON budgets(organization_id, category)
  WHERE is_active = true;

-- Enable RLS
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view budgets in their organization
CREATE POLICY "Users can view budgets in their organization"
  ON budgets
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Members and above can create budgets
CREATE POLICY "Members can create budgets"
  ON budgets
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM organization_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'member')
    )
  );

-- Users can update their own budgets, admins can update all
CREATE POLICY "Users can update budgets"
  ON budgets
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT om.organization_id
      FROM organization_members om
      WHERE om.user_id = auth.uid()
      AND (
        om.role IN ('owner', 'admin')
        OR (om.role = 'member' AND budgets.created_by = auth.uid())
      )
    )
  );

-- Users can delete their own budgets, admins can delete all
CREATE POLICY "Users can delete budgets"
  ON budgets
  FOR DELETE
  USING (
    organization_id IN (
      SELECT om.organization_id
      FROM organization_members om
      WHERE om.user_id = auth.uid()
      AND (
        om.role IN ('owner', 'admin')
        OR (om.role = 'member' AND budgets.created_by = auth.uid())
      )
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON budgets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE budgets IS 'Stores budget limits by category for tracking spending against targets';
