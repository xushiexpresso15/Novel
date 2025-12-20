-- 解決「刪除帳號後，無法重新註冊」的根源問題
-- 原因：之前的設定讓「人」刪掉了，但「名片 (Profile)」還留在原地。
-- 修正：設定「人死名除」 (Cascade Delete)，確保刪除帳號時，名片也會自動消失。

-- 1. 移除舊的約束 (如果有的話)
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. 加上帶有 Cascade 功能的新約束
ALTER TABLE profiles
ADD CONSTRAINT profiles_id_fkey
FOREIGN KEY (id) REFERENCES auth.users(id)
ON DELETE CASCADE;

-- 3. 再次確保其他關鍵部分也都有 Cascade (雙重保險)
-- (之前可能跑過了，但再跑一次無害)
ALTER TABLE chapters
DROP CONSTRAINT IF EXISTS chapters_user_id_fkey;
ALTER TABLE chapters
ADD CONSTRAINT chapters_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id)
ON DELETE CASCADE;

ALTER TABLE novels
DROP CONSTRAINT IF EXISTS novels_user_id_fkey;
ALTER TABLE novels
ADD CONSTRAINT novels_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id)
ON DELETE CASCADE;
