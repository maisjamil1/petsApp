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


app.get('/', (req, res) => {
    const url = 'https://api.petfinder.com/v2/animals'
    superagent.get(url).set({ 'Authorization':`Bearer ${process.env.PETFINDER_API_KEY}` })
    .then(apiData => {
        // const pet = apiData.body.animals;
        // let pets = pet.map(pet => {
        //     const createdPet = new Pet(pet);
        //     return createdPet;
        // })
        // res.send(pets);
        res.json(apiData.body);
    })
    .catch((err, req, res) => console.log(err))
})


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































































app.get('/pets/:petID', showFun);


function showFun(req, res) {
    let petID = req.params.petID;
    // console.log(petID);

    let sql = `SELECT * FROM pets WHERE petID = $1;`
    client.query(sql,[petID])
      .then(result=>{
    if (result.rows !== 0 ){
        res.render('./adopted/show', { data: result.rows[0] });
    }else {  
        const url = `https://api.petfinder.com/v2/animals/${petID}`;
        superagent.get(url)
        .then(result => {
            res.render('./adopted/show', { data: result.body });
            console.log(result.body);
            
        });
  }
})
}  
  







client.connect()
    .then(() => {
      
        app.listen(PORT, () => console.log(`We're live on port ${PORT} BB ^ o ^`));
      })

