-- Function to send welcome message automatically
CREATE OR REPLACE FUNCTION public.handle_new_user_welcome()
RETURNS TRIGGER AS $$
DECLARE
    admin_id UUID;
BEGIN
    -- Set the Admin ID directly
    admin_id := 'b927b334-8367-429a-8dcc-af6041438bdd'; 
    
    -- Insert the welcome message directly
    INSERT INTO public.messages (sender_id, recipient_id, content, is_read)
    VALUES (
        admin_id, 
        NEW.id, 
        '歡迎位臨WritePad!
我是網站的架設者貓薄荷，誠心地歡迎您加入WritePad。
這裡是一個開放自由的小說平台，任何一個人都可以在這裡暢寫小說、抒發靈感！
再次歡迎您的加入，現在就點擊「建立新小說」建立您的第一本小說吧！',
        FALSE
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create Trigger on profiles table
DROP TRIGGER IF EXISTS on_profile_created_welcome ON profiles;
CREATE TRIGGER on_profile_created_welcome
AFTER INSERT ON profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_welcome();
