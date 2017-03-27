SELECT trail_id, trail_name, difficulty, coords, gis_miles, time
FROM trails
WHERE trail_name IS NOT NULL AND trail_name <> ''
limit 50;
