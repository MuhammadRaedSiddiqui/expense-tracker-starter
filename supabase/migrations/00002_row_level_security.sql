-- Row Level Security (RLS) Policies
-- These policies ensure users can only access data from their organizations

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is member of organization
CREATE OR REPLACE FUNCTION is_organization_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = org_id
    AND user_id = auth.uid()
    AND joined_at IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get user's role in organization
CREATE OR REPLACE FUNCTION get_user_role(org_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM organization_members
    WHERE organization_id = org_id
    AND user_id = auth.uid()
    AND joined_at IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Organizations policies
CREATE POLICY "Users can view their organizations"
  ON organizations FOR SELECT
  USING (is_organization_member(id));

CREATE POLICY "Users can update their organizations if owner or admin"
  ON organizations FOR UPDATE
  USING (get_user_role(id) IN ('owner', 'admin'));

CREATE POLICY "Users can create organizations"
  ON organizations FOR INSERT
  WITH CHECK (true);

-- Organization members policies
CREATE POLICY "Users can view members of their organizations"
  ON organization_members FOR SELECT
  USING (is_organization_member(organization_id));

CREATE POLICY "Owners and admins can manage members"
  ON organization_members FOR ALL
  USING (get_user_role(organization_id) IN ('owner', 'admin'));

CREATE POLICY "Users can join via invitation"
  ON organization_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Categories policies
CREATE POLICY "Users can view categories in their organizations"
  ON categories FOR SELECT
  USING (is_organization_member(organization_id));

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (get_user_role(organization_id) IN ('owner', 'admin'));

-- Transactions policies
CREATE POLICY "Users can view transactions in their organizations"
  ON transactions FOR SELECT
  USING (is_organization_member(organization_id));

CREATE POLICY "Members can create transactions"
  ON transactions FOR INSERT
  WITH CHECK (
    is_organization_member(organization_id)
    AND get_user_role(organization_id) IN ('owner', 'admin', 'member')
  );

CREATE POLICY "Members can update their own transactions"
  ON transactions FOR UPDATE
  USING (
    is_organization_member(organization_id)
    AND (
      created_by = auth.uid()
      OR get_user_role(organization_id) IN ('owner', 'admin')
    )
  );

CREATE POLICY "Members can delete their own transactions"
  ON transactions FOR DELETE
  USING (
    is_organization_member(organization_id)
    AND (
      created_by = auth.uid()
      OR get_user_role(organization_id) IN ('owner', 'admin')
    )
  );

-- Attachments policies
CREATE POLICY "Users can view attachments in their organizations"
  ON attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM transactions
      WHERE transactions.id = attachments.transaction_id
      AND is_organization_member(transactions.organization_id)
    )
  );

CREATE POLICY "Users can upload attachments to their transactions"
  ON attachments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM transactions
      WHERE transactions.id = attachments.transaction_id
      AND is_organization_member(transactions.organization_id)
    )
  );

-- Budgets policies
CREATE POLICY "Users can view budgets in their organizations"
  ON budgets FOR SELECT
  USING (is_organization_member(organization_id));

CREATE POLICY "Admins can manage budgets"
  ON budgets FOR ALL
  USING (get_user_role(organization_id) IN ('owner', 'admin'));

-- Recurring transactions policies
CREATE POLICY "Users can view recurring transactions in their organizations"
  ON recurring_transactions FOR SELECT
  USING (is_organization_member(organization_id));

CREATE POLICY "Members can manage recurring transactions"
  ON recurring_transactions FOR ALL
  USING (
    is_organization_member(organization_id)
    AND get_user_role(organization_id) IN ('owner', 'admin', 'member')
  );

-- Invitations policies
CREATE POLICY "Users can view invitations for their organizations"
  ON invitations FOR SELECT
  USING (get_user_role(organization_id) IN ('owner', 'admin'));

CREATE POLICY "Admins can create invitations"
  ON invitations FOR INSERT
  WITH CHECK (get_user_role(organization_id) IN ('owner', 'admin'));

CREATE POLICY "Anyone can view their own invitation by token"
  ON invitations FOR SELECT
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Audit logs policies
CREATE POLICY "Owners and admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (get_user_role(organization_id) IN ('owner', 'admin'));

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);
