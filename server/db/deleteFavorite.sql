delete from favorites
where trail_id = $1 and authid = $2
returning trail_id;