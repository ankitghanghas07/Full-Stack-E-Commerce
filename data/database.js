const { MongoClient } = require("mongodb");

let database;

async function connectToDatabase() {
  const uri = "mongodb://127.0.0.1:27017";
  const client = new MongoClient(uri);
  await client.connect();
  database = client.db('online-shop');
}

function getDb(){
    if(!database){
        throw new Error('connection to database failed.');
    }
    return database;
}

module.exports = {
    connectToDatabase : connectToDatabase,
    getDb : getDb
};


