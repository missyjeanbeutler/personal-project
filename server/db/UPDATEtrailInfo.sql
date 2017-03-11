UPDATE trails
SET elevation = $1,
incline = $2
WHERE trail_id = $3;