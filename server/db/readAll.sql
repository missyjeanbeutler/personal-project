SELECT trail_name, coords, trail_id
FROM trails
WHERE trail_name IS NOT NULL AND trail_name <> '';
