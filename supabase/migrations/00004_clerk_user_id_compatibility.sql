-- Migration to support Clerk authentication
-- Clerk uses string-based user IDs (e.g., "user_3BtJXgzHCOUrugv3jghfl443s2J")
-- This migration removes auth.users foreign keys and changes user_id columns to TEXT

-- Step 1: Drop all RLS policies that depend on user_id columns
DROP POLICY IF EXISTS "Users can view their organizations" ON organizations;
DROP POLICY IF EXISTS "Users can update their organizations if owner or admin" ON organizations;
DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
DROP POLICY IF EXISTS "Users can view members of their organizations" ON organization_members;
DROP POLICY IF EXISTS "Owners and admins can manage members" ON organization_members;
DROP POLICY IF EXISTS "Users can join via invitation" ON organization_members;
DROP POLICY IF EXISTS "Users can view categories in their organizations" ON categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Users can view transactions in their organizations" ON transactions;
DROP POLICY IF EXISTS "Members can create transactions" ON transactions;
DROP POLICY IF EXISTS "Members can update their own transactions" ON transactions;
DROP POLICY IF EXISTS "Members can delete their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can view attachments in their organizations" ON attachments;
DROP POLICY IF EXISTS "Users can upload attachments to their transactions" ON attachments;
DROP POLICY IF EXISTS "Users can view budgets in their organizations" ON budgets;
DROP POLICY IF EXISTS "Admins can manage budgets" ON budgets;
DROP POLICY IF EXISTS "Users can view recurring transactions in their organizations" ON recurring_transactions;
DROP POLICY IF EXISTS "Members can manage recurring transactions" ON recurring_transactions;
DROP POLICY IF EXISTS "Users can view invitations for their organizations" ON invitations;
DROP POLICY IF EXISTS "Admins can create invitations" ON invitations;
DROP POLICY IF EXISTS "Anyone can view their own invitation by token" ON invitations;
DROP POLICY IF EXISTS "Owners and admins can view audit logs" ON audit_logs;
DROP POLICY IF EXISTS "System can insert audit logs" ON audit_logs;

-- Step 2: Drop helper functions
DROP FUNCTION IF EXISTS is_organization_member(UUID);
DROP FUNCTION IF EXISTS get_user_role(UUID);

-- Step 3: Drop foreign key constraints that reference auth.users
ALTER TABLE organization_members DROP CONSTRAINT IF EXISTS organization_members_user_id_fkey;
ALTER TABLE organization_members DROP CONSTRAINT IF EXISTS organization_members_invited_by_fkey;
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_created_by_fkey;
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_updated_by_fkey;
ALTER TABLE attachments DROP CONSTRAINT IF EXISTS attachments_uploaded_by_fkey;
ALTER TABLE budgets DROP CONSTRAINT IF EXISTS budgets_created_by_fkey;
ALTER TABLE recurring_transactions DROP CONSTRAINT IF EXISTS recurring_transactions_created_by_fkey;
ALTER TABLE invitations DROP CONSTRAINT IF EXISTS invitations_invited_by_fkey;
ALTER TABLE audit_logs DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey;

-- Step 4: Change user_id columns from UUID to TEXT
ALTER TABLE organization_members ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
ALTER TABLE organization_members ALTER COLUMN invited_by TYPE TEXT USING invited_by::TEXT;
ALTER TABLE transactions ALTER COLUMN created_by TYPE TEXT USING created_by::TEXT;
ALTER TABLE transactions ALTER COLUMN updated_by TYPE TEXT USING updated_by::TEXT;
ALTER TABLE attachments ALTER COLUMN uploaded_by TYPE TEXT USING uploaded_by::TEXT;
ALTER TABLE budgets ALTER COLUMN created_by TYPE TEXT USING created_by::TEXT;
ALTER TABLE recurring_transactions ALTER COLUMN created_by TYPE TEXT USING created_by::TEXT;
ALTER TABLE invitations ALTER COLUMN invited_by TYPE TEXT USING invited_by::TEXT;
ALTER TABLE audit_logs ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- Step 5: Temporarily disable RLS for Phase 1 testing
-- WARNING: This makes all data publicly accessible. Only for development!
-- We'll re-enable proper RLS with Clerk JWT integration in a future phase
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE attachments DISABLE ROW LEVEL SECURITY;
ALTER TABLE budgets DISABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE invitations DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;

-- Note: In Phase 2, we'll configure Clerk JWT integration and re-enable RLS with proper policies
