const { MongoClient } = require('mongodb');
const logger = require('../services/logger.service');
const config = require('../config');


const dbURL = process.env.DB_URL || config.dbURL;
const dbName = 'board_db'
let dbConn = null

console.log('Connecting to DB with URL:', dbURL);

async function getCollection(collectionName) {

        console.log('DB_URL:', process.env.DB_URL);
    console.log('Config dbURL:', config.dbURL);
    console.log('Final dbURL:', dbURL);

    
    try {
        const db = await connect();
        console.log('Fetching collection:', collectionName);
        return db.collection(collectionName);
    } catch (err) {
        logger.error('Failed to get Mongo collection', err)
        throw err
    }
}


async function connect() {
    if (dbConn) return dbConn
    try {
        const client = new MongoClient(dbURL);
        await client.connect();
        const db = client.db(dbName);
        dbConn = db;
        return db;

    } catch (err) {
        logger.error('Cannot Connect to DB', err)
        throw err
    }
}

module.exports = {
    getCollection
}