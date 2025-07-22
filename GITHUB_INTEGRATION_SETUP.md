# GitHub Integration Setup Guide

This guide will help you set up the GitHub integration feature that allows clients to see recent commits from their specific GitHub repositories.

## 🗄️ Step 1: Database Migration

Run the following SQL in your Supabase SQL editor:

```sql
-- Add GitHub repository fields to clients table
ALTER TABLE clients ADD COLUMN github_repo TEXT;
ALTER TABLE clients ADD COLUMN github_branch TEXT DEFAULT 'main';
ALTER TABLE clients ADD COLUMN github_enabled BOOLEAN DEFAULT false;

-- Add indexes for efficient queries
CREATE INDEX idx_clients_github_repo ON clients (github_repo);
CREATE INDEX idx_clients_github_enabled ON clients (github_enabled);

-- Add comments for documentation
COMMENT ON COLUMN clients.github_repo IS 'GitHub repository name in format "username/repo-name"';
COMMENT ON COLUMN clients.github_branch IS 'GitHub branch name (default: main)';
COMMENT ON COLUMN clients.github_enabled IS 'Whether GitHub integration is enabled for this client';

-- Update existing clients to have GitHub disabled by default
UPDATE clients SET github_enabled = false WHERE github_enabled IS NULL;
```

## 🔧 Step 2: Test the Integration

1. **Visit the admin page**: Go to `http://localhost:3001/admin/clients`
2. **Find a client**: Look for an existing client in the list
3. **Click "Edit"**: This will open the GitHub settings form
4. **Enable GitHub**: Toggle the "Enable GitHub Integration" switch
5. **Enter repository**: Add a public GitHub repository (e.g., `vercel/next.js`)
6. **Set branch**: Usually `main` or `master`
7. **Test connection**: Click "Test Connection" to verify it works
8. **Save settings**: Click "Save" to store the configuration

## 👤 Step 3: Client Dashboard Testing

1. **Login as client**: Go to the status page and login with a client account
2. **View dashboard**: Navigate to the client dashboard
3. **Check Recent Updates**: The Recent Updates section should now show commits from their configured repository
4. **Verify functionality**: Commits should display with timestamps and author information

## 📝 Step 4: Manual Database Entry (Alternative)

If you prefer to manually configure repositories in the database:

```sql
-- Example: Enable GitHub for a specific client
UPDATE clients 
SET 
  github_repo = 'username/repository-name',
  github_branch = 'main',
  github_enabled = true
WHERE email = 'client@example.com';
```

## 🔍 Step 5: Troubleshooting

### Common Issues:

1. **404 Error**: Repository doesn't exist or isn't public
   - **Solution**: Verify the repository name and ensure it's public

2. **No commits shown**: Repository exists but no commits
   - **Solution**: Check if the repository has commits and the branch exists

3. **Rate limit exceeded**: Too many API calls
   - **Solution**: Add a GitHub token to increase rate limits

### Adding GitHub Token (Optional):

For higher rate limits, add a GitHub Personal Access Token:

1. **Create token**: Go to https://github.com/settings/tokens
2. **Set permissions**: `repo` (for private repos) or `public_repo` (for public repos)
3. **Add to environment**: Add `GITHUB_TOKEN=your_token_here` to `.env.local`

## 🎯 Features Implemented:

- ✅ **Client-specific repositories**: Each client can have their own GitHub repo
- ✅ **Admin interface**: Easy management of client GitHub settings
- ✅ **Connection testing**: Verify repository access before saving
- ✅ **Real-time commits**: Display recent commits with timestamps
- ✅ **Error handling**: Graceful fallbacks for missing or invalid repos
- ✅ **Responsive design**: Works on mobile and desktop

## 🚀 Next Steps:

1. **Configure repositories**: Set up GitHub repos for each client
2. **Monitor usage**: Check the admin interface for any connection issues
3. **Customize styling**: Adjust the Recent Updates component appearance if needed
4. **Add features**: Consider adding commit filtering or search functionality

## 📞 Support:

If you encounter any issues:
1. Check the browser console for error messages
2. Verify the repository name format (username/repo-name)
3. Ensure the repository is public
4. Test the connection using the admin interface

The integration is now ready to use! Clients will see their project's recent commits in their dashboard. 