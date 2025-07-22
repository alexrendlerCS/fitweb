-- Fix GitHub repository format
-- Remove .git extension and full URL, keep only username/repository-name format

-- Update the repository format for your specific case
UPDATE clients 
SET github_repo = 'alexrendlerCS/fitweb'
WHERE github_repo = 'https://github.com/alexrendlerCS/fitweb.git';

-- Fix the personal-trainer repository format
UPDATE clients 
SET github_repo = 'alexrendlerCS/personal-trainer'
WHERE github_repo = 'https://github.com/alexrendlerCS/personal-trainer';

-- Also fix any other common formats that might exist
UPDATE clients 
SET github_repo = REPLACE(github_repo, '.git', '')
WHERE github_repo LIKE '%.git';

UPDATE clients 
SET github_repo = REPLACE(github_repo, 'https://github.com/', '')
WHERE github_repo LIKE 'https://github.com/%';

UPDATE clients 
SET github_repo = REPLACE(github_repo, 'http://github.com/', '')
WHERE github_repo LIKE 'http://github.com/%';

-- Verify the changes
SELECT id, email, github_repo, github_branch, github_enabled 
FROM clients 
WHERE github_enabled = true; 