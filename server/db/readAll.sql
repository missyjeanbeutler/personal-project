SELECT trail_name, trail_id, coords
FROM trails
WHERE trail_name IS NOT NULL AND trail_name <> '';
