const express = require('express');
const cors = require('cors');
const { getMongoData } = require('./MongoDBService');

const app = express();
const port = 5000;

app.use(cors());

app.get('/digimonData', async (req, res) => {
  try {
    const booster = req.query.booster; // Get the value of the 'booster' query parameter
    const data = await getMongoData("digimoncardgame");

    const filteredData = booster
      ? data.filter(digimon => digimon.booster.toLowerCase() === booster.toLowerCase())
      : data;


    res.json(filteredData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/uaData', async (req, res) => {
  try {
    const booster = req.query.booster; // Get the value of the 'booster' query parameter
    const data = await getMongoData("unionarena");

    const filteredData = booster
      ? data.filter(digimon => digimon.booster.toLowerCase() === booster.toLowerCase())
      : data;


    res.json(filteredData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/dtcgbooster', async (req, res) => {
  try{
    const data = await getMongoData("digimonboosterlist")

    res.json(data);
  }catch(error){
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => console.log('Server started on port 5000'));
