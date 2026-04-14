-- Create RPC function for atomic organization creation
-- This ensures organization and organization_member are created in a single transaction
-- preventing orphaned organizations if the member insert fails

CREATE OR REPLACE FUNCTION create_organization_with_member(
  org_name TEXT,
  org_slug TEXT,
  user_id TEXT
) RETURNS organizations AS $$
DECLARE
  new_org organizations;
BEGIN
  -- Insert organization
  INSERT INTO organizations (name, slug, created_at, updated_at)
  VALUES (org_name, org_slug, NOW(), NOW())
  RETURNING * INTO new_org;

  -- Insert organization member (owner role)
  INSERT INTO organization_members (organization_id, user_id, role, joined_at)
  VALUES (new_org.id, user_id, 'owner', NOW());

  -- Return the created organization
  RETURN new_org;
EXCEPTION
  WHEN OTHERS THEN
    -- If anything fails, the entire transaction is rolled back
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_organization_with_member(TEXT, TEXT, TEXT) TO authenticated;
