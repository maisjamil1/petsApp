DROP TABLE IF EXISTS pets;

 CREATE TABLE pets (

 id SERIAL PRIMARY KEY,
 pet_id VARCHAR(255),
 pet_type VARCHAR(255),
 pet_name VARCHAR(255),
 pet_species VARCHAR(255),
 pet_breed VARCHAR(255),
 pet_colors VARCHAR(255),
 pet_age VARCHAR(255),
 pet_gender VARCHAR(255),
 pet_size VARCHAR(255),
 pet_is_trained VARCHAR(255),
 pet_is_vacsinated VARCHAR(255),
 pet_description TEXT,
 pet_image_url JSON,
 contact_email VARCHAR(255),
 contact_mobile VARCHAR(255),
 contact_city VARCHAR(255),
 contact_state VARCHAR(255)
 );