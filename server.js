
// curl -d "grant_type=client_credentials&client_id=8CkHxCo6UyK3VArr3OYiNyjbgxIDxNnnTBtkeBlQUDukRHWL3M&client_secret=MUzz7c0B2ckRIWBkH0iqdVkRDqyigYA8XM3Rn2Zu" https://api.petfinder.com/v2/oauth2/token

'use strict'

require('dotenv').config();

const express = require('express');

const cors = require('cors');

const superagent = require('superagent');

const pg = require('pg');

const methodOverride = require('method-override');

const PORT = process.env.PORT || 4000;

const app = express();

const client = new pg.Client(process.env.DATABASE_URL);

app.use(express.static('./public'));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.set('view engine', 'ejs');


app.use('/public', express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.set('view engine', 'ejs');


app.get('/', homePage);
app.get('/searches/new', searchPage);
app.post('/searches/', searchResults);
app.get('/pets/:petID', showPetDetails);
app.post('/pets/', addPetToAdopted);
app.get('/adoptedpets/', showAdoptedPets);


/////////////// Tommalieh ///////////////////////////////////////////////////

function homePage(req, res) {

    const url = 'https://api.petfinder.com/v2/animals'
    superagent.get(url).set({ 'Authorization': `Bearer ${process.env.PETFINDER_API_KEY}` })
        .then(apiData => {
            const pet = apiData.body.animals;
            let pets = [];
            pet.forEach(petData => {
                // console.log(petData.photos.length)
                if (petData.photos.length !== 0) {
                    console.log('>0')
                    const createdPet = new Pet(petData);
                    pets.push(createdPet);
                }
                else {
                    console.log('0')
                    '';
                }
            })
            // res.send(pets);
            // res.json(apiData.body); 
            console.log(pets[0])
            res.render('./pages/index' , { pets: pets })
        })
        .catch((err, req, res) => console.log(err))
};

function searchPage(req, res) {
    res.render('./pages/searches/new');
};


function searchResults(req, res) {
    const location = req.body.location;
    const type = req.body.type;
    const gender = req.body.gender;
    const url = `https://api.petfinder.com/v2/animals?location=${location}&type=${type}&gender=${gender ? gender : ''}`
    superagent.get(url).set({ 'Authorization': `Bearer ${process.env.PETFINDER_API_KEY}` })
        .then(apiData => {
            console.log(apiData.body)
            const pet = apiData.body.animals;
            let pets = [];
            pet.forEach(petData => {
                // console.log(petData.photos.length)
                if (petData.photos.length !== 0) {
                    console.log('>0')
                    const createdPet = new Pet(petData);
                    pets.push(createdPet);
                }
                else {
                    console.log('0')
                    '';
                }
            })
            // res.send(pets);
            // res.json(apiData.body); 
            // console.log(pets[0])
            res.render('./pages/searches/show', { pets: pets })
        })
        .catch((err, req, res) => console.log(err))
};

/////////////// Tommalieh ///////////////////////////////////////////////////  


//////////////////////////////// Ahmad ///////////////////////////////////////////////

function showPetDetails(req, res) {
    const petID = [req.params.petID];
    console.log('petID', petID);
    const SQL = 'SELECT * FROM pets WHERE pet_id = $1';
    client.query(SQL, petID).then((petsDetails) => {
        console.log(petsDetails);
        if (petsDetails.rows.length !== 0) {
            console.log('fromDataBase');
            res.render('./pages/pets/show', { pet: petsDetails.rows[0] })
        }

        else {
            const url = `https://api.petfinder.com/v2/animals/${petID}`;
            superagent.get(url).set({ 'Authorization': `Bearer ${process.env.PETFINDER_API_KEY}` })
                .then(apiData => {
                    const petData = apiData.body.animal;
                    const createdPet = new Pet(petData);
                    res.render('./pages//pets/show', { pet: createdPet })
                })
                .catch((err, req, res) => console.log(err))
        }
    })
        .catch((err, req, res) => console.log(err))
}

////////////////////////////////// Ahmad /////////////////////////////////////////


///////////////////////////Thaer//////////////////////////////////////////////

function addPetToAdopted(req, res) {
    const petID = req.body.petID;
    console.log(petID);
    const SQL = 'SELECT * FROM pets WHERE pet_id = $1'
    client.query(SQL, [petID]).then(result => {
        if (result.rows.length !== 0) {
            console.log('stored 2')
            res.redirect(`/adoptedpets/`)
        }
        else {
            console.log('not stored 2')
            const url = `https://api.petfinder.com/v2/animals/${petID}`;
            superagent.get(url).set({ 'Authorization': `Bearer ${process.env.PETFINDER_API_KEY}` })
                .then(apiData => {
                    // res.status(200).json(apiData.body)
                    const petData = apiData.body.animal;
                    const pet = new Pet(petData);
                    const SQL = 'INSERT INTO pets (pet_id, pet_type, pet_name, pet_species, pet_breed, pet_colors, pet_age, pet_gender, pet_size, pet_is_trained, pet_is_vacsinated, pet_description, pet_image_url, contact_email, contact_mobile, contact_city, contact_state) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *'
                    const values = [
                    pet.pet_id, pet.pet_type, pet.pet_name, pet.pet_species, pet.pet_breed, 
                    pet.pet_colors, pet.pet_age, pet.pet_gender, pet.pet_size, pet.pet_is_trained, 
                    pet.pet_is_vacsinated, pet.pet_description, pet.pet_image_url, pet.contact_email, 
                    pet.contact_mobile, pet.contact_city, pet.contact_state
                ]
                    client.query(SQL, values).then(result => {
                        res.redirect(`/adoptedpets/`)
                        // res.status(200).json(result.rows[0]);
                    })
                }).catch((err) => {
                    console.log(err);
                    // errorHandler(err, req, res);
                });
        }
    })
}

///////////////////////////////////Thaer/////////////////////////////////////////


function showAdoptedPets(req, res) {
    const SQL = 'SELECT * FROM pets '
    client.query(SQL).then(result => {
        console.log('RESULT DATA', result.rows);
        res.render('./pages/adopted/show', { pets: result.rows })
    })
}


// curl -d "grant_type=client_credentials&client_id=ETHzj63pOADq1dtarMeN88FtVGQZsVkiqAH46NYLTdNLRjrDF8&client_secret=b0i0M466DoJHGvZRCok92uRmOxNwvXkOVa9wUJIj" https://api.petfinder.com/v2/oauth2/token

/////////////// Tommalieh ///////////////////////////////////////////////////  

function Pet(petApiData) {
    this.pet_id = petApiData.id;
    this.pet_type = petApiData.type;
    this.pet_name = petApiData.name;
    this.pet_species = petApiData.species;
    this.pet_breed = petApiData.breeds.primary;
    this.pet_colors = [petApiData.colors.primary, petApiData.colors.secondary, petApiData.colors.tertiary];
    this.pet_age = petApiData.age;
    this.pet_gender = petApiData.gender;
    this.pet_size = petApiData.size;
    this.pet_is_trained = petApiData.attributes.house_trained;
    this.pet_is_vacsinated = petApiData.attributes.shots_current;
    this.pet_description = petApiData.description;
    this.pet_image_url = petApiData.photos[0];
    this.contact_email = petApiData.contact.email;
    this.contact_mobile = petApiData.contact.phone;
    this.contact_city = petApiData.contact.address.city;
    this.contact_state = petApiData.contact.address.state;
    console.log(this);
}

// app.listen(PORT, () => console.log(`We're live on port ${PORT} BB ^ o ^`));


client.connect()
    .then(() => {
        app.listen(PORT, () => console.log(`We're live on port ${PORT} BB ^ o ^`));
    })
    .catch(err => console.log(err))

/////////////// Tommalieh ///////////////////////////////////////////////////  

