-- Insert default categories for new organizations
-- This function will be called when a new organization is created

CREATE OR REPLACE FUNCTION create_default_categories(org_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Default expense categories
  INSERT INTO categories (organization_id, name, type, icon, color, is_default) VALUES
    (org_id, 'Food & Dining', 'expense', '🍔', '#ef4444', true),
    (org_id, 'Transportation', 'expense', '🚗', '#f59e0b', true),
    (org_id, 'Shopping', 'expense', '🛍️', '#ec4899', true),
    (org_id, 'Entertainment', 'expense', '🎬', '#8b5cf6', true),
    (org_id, 'Bills & Utilities', 'expense', '💡', '#3b82f6', true),
    (org_id, 'Healthcare', 'expense', '🏥', '#10b981', true),
    (org_id, 'Education', 'expense', '📚', '#06b6d4', true),
    (org_id, 'Travel', 'expense', '✈️', '#6366f1', true),
    (org_id, 'Other Expenses', 'expense', '📦', '#64748b', true);

  -- Default income categories
  INSERT INTO categories (organization_id, name, type, icon, color, is_default) VALUES
    (org_id, 'Salary', 'income', '💰', '#10b981', true),
    (org_id, 'Freelance', 'income', '💼', '#059669', true),
    (org_id, 'Investment', 'income', '📈', '#14b8a6', true),
    (org_id, 'Gift', 'income', '🎁', '#22c55e', true),
    (org_id, 'Other Income', 'income', '💵', '#84cc16', true);
END;
$$ LANGUAGE plpgsql;

-- Trigger to create default categories when organization is created
CREATE OR REPLACE FUNCTION trigger_create_default_categories()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_default_categories(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_organization_created
  AFTER INSERT ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_create_default_categories();
