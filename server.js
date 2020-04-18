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
        res.send('hi');
    })
    .catch((err, req, res) => console.log(err))
})


function Pet (petApiData){
    this.name = petApiData.name;
}


app.listen(PORT, () => console.log(`We're live on port ${PORT} BB ^ o ^`));