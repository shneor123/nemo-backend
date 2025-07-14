const { MongoClient } = require('mongodb');
const logger = require('../services/logger.service');
const config = require('../config');

const dbURL =  "mongodb+srv://shneor333:Y0bfbbrNir35vTi4@nemonew.djdu6sc.mongodb.net/board_db?retryWrites=true&w=majority";
const dbName = 'board_db';

let dbConn = null;

console.log('🌐 Connecting to DB with URL:', dbURL);

async function getCollection(collectionName) {
    try {
        const db = await connect();
        console.log(`📂 Fetching collection: ${collectionName}`);
        return db.collection(collectionName);
    } catch (err) {
        logger.error('❌ Failed to get Mongo collection', err);
        throw err;
    }
}

async function connect() {
    if (dbConn) return dbConn;
    try {
        const client = await MongoClient.connect(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = client.db(dbName);
        dbConn = db;
        console.log('✅ Connected to DB!');
        return db;
    } catch (err) {
        logger.error('❌ Cannot Connect to DB', err);
        throw err;
    }
}

module.exports = {
    getCollection,
};
