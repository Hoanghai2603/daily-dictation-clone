-- Replace 'your_email@example.com' with your actual email address
INSERT INTO app_admins (email)
VALUES ('your_email@example.com')
ON CONFLICT (email) DO NOTHING;

-- Verify it was added
SELECT * FROM app_admins;
