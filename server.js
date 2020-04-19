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














































// app.put('/update/:update_book', newUpdate);
// function newUpdate (req , res){
//   //collect
//   let { author, title, isbn, image_url, description ,bookshelf} = req.body;
//   //update
  
//   let SQL = 'UPDATE pets set pettype=$1,petbread=$2,petcolor=$3,image_url=$4,description=$5,bookshelf=$6 WHERE id=$7 ;';
//   //safevalues
//   let idParam = req.params.update_pet;
//   let safeValues = [pettype,petbread,petage,petcolor,ownerName,ownerContact,location,description,idParam];
//   client.query(SQL,safeValues)
//     .then(()=>{
//       res.redirect(`/pets/${idParam}`);
//     })
// }




















app.post('/pets', saveToDB);

function saveToDB(req, res) {

  
    let {name, type, age,image_url} = req.body;

    if (req.body === 0) {

        let SQL = 'INSERT INTO pets (name,type,age,image_url) VALUES ($1,$2,$3,$4);';
        let safeValues = [name,type,age,image_url];
        // let safetitle =[title2];
        const SQL2 = 'SELECT * FROM pets WHERE name =$1;';
      
        client.query(SQL, safeValues)
          .then(() => {
          })
          return client.query(SQL2,safetitle)
            .then(result => {
              // console.log(result.rows[0].id);
              ln=result.rows[0].id;
              res.redirect(`/books/${ln}`);
            })
    }
}
    // console.log(req.body);
  
  







client.connect()
    .then(() => {
      
        app.listen(PORT, () => console.log(`We're live on port ${PORT} BB ^ o ^`));
      })

