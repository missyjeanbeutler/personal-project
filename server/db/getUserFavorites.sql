select trails.trail_id, trail_name
from trails
INNER JOIN favorites
ON favorites.trail_id = trails.trail_id
where favorites.authid = $1;