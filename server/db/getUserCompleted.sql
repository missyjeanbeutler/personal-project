select trails.trail_id, trail_name, elevation, gis_miles, date
from trails
INNER JOIN completed
ON trails.trail_id = completed.trail_id
where completed.authid = $1;