const { MongoClient } = require('mongodb');
const logger = require('../services/logger.service');
const config = require('../config');


const dbURL = process.env.DB_URL || 'mongodb+srv://shneor333:Y0bfbbrNir35vTi4@nemonew.djdu6sc.mongodb.net/?retryWrites=true&w=majority&ssl=true';
const dbName = 'board_db'
let dbConn = null

console.log('Connecting to DB with URL:', dbURL);

async function getCollection(collectionName) {
    console.log('🔄 Starting getCollection for:', collectionName);
    console.log('DB_URL:', process.env.DB_URL);
    console.log('Config dbURL:', config.dbURL);
    console.log('Final dbURL:', dbURL);
    
    try {
        console.log('🔄 Attempting to connect to database...');
        const db = await connect();
        console.log('✅ Database connected successfully');
        console.log('🔄 Fetching collection:', collectionName);
        const collection = db.collection(collectionName);
        console.log('✅ Collection fetched successfully:', collection.collectionName);
        return collection;
    } catch (err) {
        console.error('❌ Failed to get collection:', err);
        logger.error('Failed to get Mongo collection', err);
        throw err;
    }
}



async function connect() {
    if (dbConn) {
        console.log('✅ Using existing database connection');
        return dbConn;
    }
    
    try {
        console.log('🔄 Creating new MongoDB connection...');
        console.log('🔄 Connection URL:', dbURL);
        
        const client = new MongoClient(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true,
            tlsAllowInvalidCertificates: true, // רק לבדיקה
            tlsAllowInvalidHostnames: true,    // רק לבדיקה
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        console.log('🔄 Connecting to client...');
        await client.connect();
        console.log('✅ Client connected successfully');
        
        console.log('🔄 Getting database:', dbName);
        const db = client.db(dbName);
        console.log('✅ Database obtained successfully');
        dbConn = db;
        return db;
    } catch (err) {
        console.error('❌ Cannot Connect to DB:', err);
        logger.error('Cannot Connect to DB', err);
        throw err;
    }
}


module.exports = {
    getCollection
}