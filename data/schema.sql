DROP TABLE IF EXISTS pets;
 CREATE TABLE pets(
 id SERIAL PRIMARY KEY,
 pettyp VARCHAR(255),
 petbreed VARCHAR(255),
 petage VARCHAR(255),
 petcolor VARCHAR(255),
 ownername VARCHAR(255),
 ownercontact VARCHAR(255),
 location VARCHAR(255),
 description TEXT
 );