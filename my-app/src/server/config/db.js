const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
    serverApi: ServerApiVersion.v1,
});
const dbName = 'AutoMod';

const connectDB = async () => {
    try {
        await client.connect();
        console.log('Connected to the database');
        return client.db(dbName);
    } catch (err) {
        console.error('Database connection error:', err);
        throw err;
    }
};

module.exports = { connectDB, client };
