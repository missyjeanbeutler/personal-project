SELECT trail_id, trail_name, difficulty, head, gis_miles, time
FROM trails
WHERE trail_name IS NOT NULL AND trail_name <> '' AND head IS NOT NULL
-- limit 50;
