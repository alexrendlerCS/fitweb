-- Add GitHub repository fields to clients table
-- This allows linking each client to their specific GitHub project

-- Add github_repo field to store the repository name (e.g., "username/repo-name")
ALTER TABLE clients ADD COLUMN github_repo TEXT;

-- Add github_branch field to store the branch name (default: "main")
ALTER TABLE clients ADD COLUMN github_branch TEXT DEFAULT 'main';

-- Add github_enabled field to enable/disable GitHub integration per client
ALTER TABLE clients ADD COLUMN github_enabled BOOLEAN DEFAULT false;

-- Add index for efficient queries on github_repo
CREATE INDEX idx_clients_github_repo ON clients (github_repo);

-- Add index for enabled GitHub integrations
CREATE INDEX idx_clients_github_enabled ON clients (github_enabled);

-- Add comment to document the new fields
COMMENT ON COLUMN clients.github_repo IS 'GitHub repository name in format "username/repo-name"';
COMMENT ON COLUMN clients.github_branch IS 'GitHub branch name (default: main)';
COMMENT ON COLUMN clients.github_enabled IS 'Whether GitHub integration is enabled for this client';

-- Update existing clients to have GitHub disabled by default
UPDATE clients SET github_enabled = false WHERE github_enabled IS NULL; 