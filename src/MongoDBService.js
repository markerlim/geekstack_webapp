const { MongoClient } = require('mongodb');
const dotenv = require('dotenv').config();

const uri =  process.env.REACT_APP_MONGODB_URI; // Replace with your MongoDB connection URI
const client = new MongoClient(uri);

async function getMongoData(collectionName) {
  try {
    await client.connect();
    const database = client.db('uniondeck'); // Replace with your database name
    const collection = database.collection(collectionName); // Replace with your collection name
    const data = await collection.find().toArray();
    return data;
  } finally {
    await client.close();
  }
}

module.exports = { getMongoData };
