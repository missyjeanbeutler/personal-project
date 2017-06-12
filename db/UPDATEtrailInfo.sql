UPDATE trails
SET elevation = $1,
incline = $2,
time = $5,
difficulty = $4,
head = $6
WHERE trail_id = $3;