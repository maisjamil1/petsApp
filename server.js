
'use strict'

require('dotenv').config();

const express = require('express');

const cors = require('cors');

const superagent = require('superagent');

const pg = require('pg');

const methodOverride = require('method-override');

const PORT = process.env.PORT || 4000;

const app = express();

// const client = new pg.Client(process.env.DATABASE_URL);

app.use('/public', express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.set('view engine', 'ejs');


app.get('/', homePage);
app.get('/searches/new', searchPage);
app.post('/searches/', searchResults);


/////////////// Tommalieh ///////////////////////////////////////////////////

function homePage(req, res){

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
            res.render('./pages/index', { pets: pets })
        })
        .catch((err, req, res) => console.log(err))
};

function searchPage(req, res){
    res.render('./pages/searches/new');
};



function searchResults(req, res){
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



//////////////////////////////// Ahmad ///////////////////////////////////////////////

app.get('/pets/:petsID' ,(req,res)=>{
    const petsID = [req.params.petsID];
    console.log('petsID',petsID);
    const SQL = 'SELECT * FROM pets WHERE id=$1';
    // client.query(SQL , petsID).then((petsDetails)=>{
        // console.log(petsDetails);
        // if(petsDetails.rows.length !== 0){
        //     console.log('fromDataBase');
        //     res.render('./pages/pets/show', {pet : petsDetails.rows[0]})

        // } else {
            const url = 'https://api.petfinder.com/v2/animals'
            superagent.get(url).set({ 'Authorization':`Bearer ${process.env.PETFINDER_API_KEY}` })
            .then((petsDetails)=>{
                // console.log(petsDetails.body);
                console.log('website')
                // let pets =[];
                // const newPets = new Pet(petsDetails.body.animals);
                // pets.push(newPets);

                res.render('./pages/pets/show' , { pet : petsDetails.body.animals })
            // })
        // }

    }).catch((err)=> console.log(err));
})


////////////////////////////////// Ahmad /////////////////////////////////////////



// curl -d "grant_type=client_credentials&client_id=fEhubHznuC430W5elpJg9HgdPjRJYCpkB0iC3oM7EkxYzwsWmH&client_secret=kYipSPxEc9hKsjuUpaMUwClWGk2om5rs6aCcizLX" https://api.petfinder.com/v2/oauth2/token

































////////////////////////////////////////////////// ahmad  ///////////////////////////////////////////

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

// client.connect()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Listening on PORT ${PORT}`)
//     })
//   })


app.listen(PORT, () => console.log(`We're live on port ${PORT} BB ^ o ^`));

/////////////// Tommalieh ///////////////////////////////////////////////////     
