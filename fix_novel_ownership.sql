-- 1. 設定您的 Google Email (請將下方的 email 換成您自己的)
\set my_email 'your_email@gmail.com'

-- 2. 執行更新
-- 這會把「所有」目前被標記為 "Unknown Author" (或者所有小說) 的作品，都轉移到這個 Email 名下。
UPDATE novels
SET user_id = (SELECT id FROM auth.users WHERE email = :'my_email')
WHERE user_id IN (
    SELECT id FROM profiles WHERE username = 'Unknown Author'
    -- 或者，如果您想把 資料庫裡「全部」小說都變成您的，可以把上面這行註解掉 (加上 --)
);

-- 3. 確保您的 Profile 存在 (如果是新帳號可能還沒建立)
INSERT INTO profiles (id, username, avatar_url)
SELECT id, raw_user_meta_data->>'full_name', raw_user_meta_data->>'avatar_url'
FROM auth.users
WHERE email = :'my_email'
AND NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.users.id);

-- 4. 檢查結果
SELECT title, user_id, (SELECT email FROM auth.users WHERE id = novels.user_id) as owner_email
FROM novels;
