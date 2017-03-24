insert into favorites
(authid, trail_id)
values
($2, $1)
returning trail_id;