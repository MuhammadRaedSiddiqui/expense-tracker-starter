-- Re-enable RLS and create policies for Clerk JWT authentication
-- This migration re-enables Row Level Security and creates policies that work with Clerk authentication

-- Step 1: Re-enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Step 2: Create helper function to extract Clerk user ID from JWT
-- Clerk stores the user ID in the 'sub' claim of the JWT token
CREATE OR REPLACE FUNCTION get_clerk_user_id()
RETURNS TEXT AS $$
DECLARE
  jwt_claims JSONB;
  user_id TEXT;
BEGIN
  -- Get JWT claims from the request
  BEGIN
    jwt_claims := current_setting('request.jwt.claims', true)::jsonb;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN NULL;
  END;

  -- Extract 'sub' claim (Clerk user ID)
  IF jwt_claims IS NOT NULL THEN
    user_id := jwt_claims->>'sub';
    RETURN user_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create helper function to check if user is member of organization
CREATE OR REPLACE FUNCTION is_organization_member(org_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_id TEXT;
BEGIN
  user_id := get_clerk_user_id();

  IF user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = org_id
    AND user_id = get_clerk_user_id()
    AND joined_at IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Create helper function to get user's role in organization
CREATE OR REPLACE FUNCTION get_user_role(org_id UUID)
RETURNS TEXT AS $$
DECLARE
  user_id TEXT;
BEGIN
  user_id := get_clerk_user_id();

  IF user_id IS NULL THEN
    RETURN NULL;
  END IF;

  RETURN (
    SELECT role FROM organization_members
    WHERE organization_id = org_id
    AND user_id = get_clerk_user_id()
    AND joined_at IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create RLS policies for organizations table
CREATE POLICY "Users can view their organizations"
  ON organizations FOR SELECT
  USING (is_organization_member(id));

CREATE POLICY "Users can update their organizations if owner or admin"
  ON organizations FOR UPDATE
  USING (get_user_role(id) IN ('owner', 'admin'));

CREATE POLICY "Users can create organizations"
  ON organizations FOR INSERT
  WITH CHECK (true);

-- Step 6: Create RLS policies for organization_members table
CREATE POLICY "Users can view members of their organizations"
  ON organization_members FOR SELECT
  USING (is_organization_member(organization_id));

CREATE POLICY "Owners and admins can manage members"
  ON organization_members FOR ALL
  USING (get_user_role(organization_id) IN ('owner', 'admin'));

CREATE POLICY "Users can join via invitation"
  ON organization_members FOR INSERT
  WITH CHECK (user_id = get_clerk_user_id());

-- Step 7: Create RLS policies for categories table
CREATE POLICY "Users can view categories in their organizations"
  ON categories FOR SELECT
  USING (is_organization_member(organization_id));

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (get_user_role(organization_id) IN ('owner', 'admin'));

-- Step 8: Create RLS policies for transactions table
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
      created_by = get_clerk_user_id()
      OR get_user_role(organization_id) IN ('owner', 'admin')
    )
  );

CREATE POLICY "Members can delete their own transactions"
  ON transactions FOR DELETE
  USING (
    is_organization_member(organization_id)
    AND (
      created_by = get_clerk_user_id()
      OR get_user_role(organization_id) IN ('owner', 'admin')
    )
  );

-- Step 9: Create RLS policies for attachments table
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

-- Step 10: Create RLS policies for budgets table
CREATE POLICY "Users can view budgets in their organizations"
  ON budgets FOR SELECT
  USING (is_organization_member(organization_id));

CREATE POLICY "Admins can manage budgets"
  ON budgets FOR ALL
  USING (get_user_role(organization_id) IN ('owner', 'admin'));

-- Step 11: Create RLS policies for recurring_transactions table
CREATE POLICY "Users can view recurring transactions in their organizations"
  ON recurring_transactions FOR SELECT
  USING (is_organization_member(organization_id));

CREATE POLICY "Members can manage recurring transactions"
  ON recurring_transactions FOR ALL
  USING (
    is_organization_member(organization_id)
    AND get_user_role(organization_id) IN ('owner', 'admin', 'member')
  );

-- Step 12: Create RLS policies for invitations table
CREATE POLICY "Users can view invitations for their organizations"
  ON invitations FOR SELECT
  USING (get_user_role(organization_id) IN ('owner', 'admin'));

CREATE POLICY "Admins can create invitations"
  ON invitations FOR INSERT
  WITH CHECK (get_user_role(organization_id) IN ('owner', 'admin'));

-- Step 13: Create RLS policies for audit_logs table
CREATE POLICY "Owners and admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (get_user_role(organization_id) IN ('owner', 'admin'));

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

-- Note: For RLS to work properly with Clerk JWT, you need to configure Supabase to validate Clerk tokens
-- This requires setting up custom JWT validation in Supabase Dashboard or using an Edge Function
