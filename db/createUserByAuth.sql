insert into users (username, authid, photo) values ($1, $2, $3) returning username, authid, photo;
