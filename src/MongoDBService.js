const { MongoClient } = require('mongodb');

const uri = process.env.REACT_APP_MONGODB_URI;
const client = new MongoClient(uri);

async function getMongoData(collectionName) {
  try {
    await client.connect();
    const database = client.db('uniondeck');
    const collection = database.collection(collectionName);
    const data = await collection.find().toArray();
    return data;
  } finally {
    await client.close();
  }
}

module.exports = { getMongoData };
