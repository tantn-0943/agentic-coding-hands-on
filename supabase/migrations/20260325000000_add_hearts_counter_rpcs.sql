-- RPC functions for atomically updating hearts_received_count
-- Used by toggleHeart() server action to keep denormalized counter in sync

CREATE OR REPLACE FUNCTION increment_hearts_received(target_user_id UUID, amount INT)
RETURNS VOID AS $$
BEGIN
  UPDATE user_profiles
  SET hearts_received_count = hearts_received_count + amount
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_hearts_received(target_user_id UUID, amount INT)
RETURNS VOID AS $$
BEGIN
  UPDATE user_profiles
  SET hearts_received_count = GREATEST(0, hearts_received_count - amount)
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
