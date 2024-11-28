// const { MongoClient, ServerApiVersion } = require('mongodb');
// require('dotenv').config();

// const uri = process.env.MONGO_URI;
// const client = new MongoClient(uri, {
//     serverApi: ServerApiVersion.v1,
// });
// const dbName = 'AutoMod';

// const connectDB = async () => {
//     try {
//         await client.connect();
//         console.log('Connected to the database');
//         return client.db(dbName);
//     } catch (err) {
//         console.error('Database connection error:', err);
//         throw err;
//     }
// };

// module.exports = { connectDB, client };

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000, // 10 seconds timeout
        });
        console.log('Connected to the database');
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1); // Exit if connection fails
    }
};

module.exports = connectDB;

