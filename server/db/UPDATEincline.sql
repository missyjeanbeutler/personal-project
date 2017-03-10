UPDATE trails
SET incline_percent = $1 
WHERE trail_id = $2;