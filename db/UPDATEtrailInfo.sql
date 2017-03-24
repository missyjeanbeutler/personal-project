UPDATE trails
SET elevation = $1,
incline = $2,
difficulty = $4,
time = $5,
gradient = $6
WHERE trail_id = $3;