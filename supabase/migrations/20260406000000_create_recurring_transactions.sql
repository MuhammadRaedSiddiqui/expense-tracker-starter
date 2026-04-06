-- Create recurring_transactions table
CREATE TABLE recurring_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Transaction details (same as regular transactions)
  description TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,

  -- Recurrence settings
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
  interval INTEGER NOT NULL DEFAULT 1 CHECK (interval > 0), -- Every X frequency units
  start_date DATE NOT NULL,
  end_date DATE, -- NULL means indefinite
  next_execution_date DATE NOT NULL,
  last_execution_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Metadata
  created_by UUID NOT NULL,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Create index for efficient querying
CREATE INDEX idx_recurring_transactions_org ON recurring_transactions(organization_id);
CREATE INDEX idx_recurring_transactions_next_execution ON recurring_transactions(next_execution_date) WHERE is_active = true;
CREATE INDEX idx_recurring_transactions_active ON recurring_transactions(is_active);

-- Enable RLS
ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view recurring transactions in their organization
CREATE POLICY "Users can view recurring transactions in their organization"
  ON recurring_transactions
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Members and above can create recurring transactions
CREATE POLICY "Members can create recurring transactions"
  ON recurring_transactions
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM organization_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'member')
    )
  );

-- Users can update their own recurring transactions, admins can update all
CREATE POLICY "Users can update recurring transactions"
  ON recurring_transactions
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT om.organization_id
      FROM organization_members om
      WHERE om.user_id = auth.uid()
      AND (
        om.role IN ('owner', 'admin')
        OR (om.role = 'member' AND recurring_transactions.created_by = auth.uid())
      )
    )
  );

-- Users can delete their own recurring transactions, admins can delete all
CREATE POLICY "Users can delete recurring transactions"
  ON recurring_transactions
  FOR DELETE
  USING (
    organization_id IN (
      SELECT om.organization_id
      FROM organization_members om
      WHERE om.user_id = auth.uid()
      AND (
        om.role IN ('owner', 'admin')
        OR (om.role = 'member' AND recurring_transactions.created_by = auth.uid())
      )
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_recurring_transactions_updated_at
  BEFORE UPDATE ON recurring_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE recurring_transactions IS 'Stores recurring transaction templates that automatically create transactions on schedule';
