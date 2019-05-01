const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// based on code in api docs at http://mongodb.github.io/node-mongodb-native/3.2/quick-start/quick-start/
// Database Info
const url = 'mongodb://localhost:27017';
const dbName = 'sw-guild-project-1';

class DBClient {
    constructor() {
        // Create a new MongoClient
        this.client = new MongoClient(url, { useNewUrlParser: true });
    }

    // replacement for boilerplate collection get (condense to 1 line)
    getCollection(collectionName) {
        const db = this.client.db(dbName); // based on boilerplate at api docs (link above)
        return db.collection(collectionName);
    }

    // Inserts/Updates
    updateDataInCollection(filter, data, collectionName, callback) {
        // Create new connection to follow general model for db interaction (per https://www.mongodb.com/blog/post/the-modern-application-stack-part-2-using-mongodb-with-nodejs)
        this.client.connect((error) => {
            assert.equal(null, error); // based on boilerplate at api docs (link above)
            const collection = this.getCollection(collectionName);

            collection.updateOne(filter, { $set : data }, { upsert: true },(error, result) => {
                assert.equal(null, error);
                callback(error, result);
            });
        });
    }

    // Queries
    showDataInCollection(collectionName, callback) {
        this.client.connect((error) => {
            assert.equal(null, error); // based on boilerplate at api docs (link above)
            const collection = this.getCollection(collectionName);

            collection.find({}).toArray((error, result) => {
                assert.equal(null, error);
                callback(error, result);
            });
        });
    }

    findDataInCollection(query, collectionName, callback) {
        this.client.connect((error) => {
            assert.equal(null, error); // based on boilerplate at api docs (link above)
            const collection = this.getCollection(collectionName);

            collection.find(query).toArray((error, result) => {
                assert.equal(null, error);
                callback(error, result);
            });
        });
    }

    // Specialized Siege Match queries
    getMostRecentSiegeMatch(callback) {
        this.client.connect((error) => {
            assert.equal(null, error); // based on boilerplate at api docs (link above)
            const collection = this.getCollection('siegeMatches');

            collection.find().sort({ siege_id: -1 }).limit(1).next((error, result) => {
                assert.equal(null, error);
                callback(error, result);
            });
        });
    }

    getSiegeMatchIDs(limit, callback) {
        this.client.connect((error) => {
            assert.equal(null, error); // based on boilerplate at api docs (link above)
            const collection = this.getCollection('siegeMatches');

            collection.find({}, { projection: {_id: 0, siege_id: 1} }) // mongoDB _id displayed unless explicitly told not to
            .limit(limit).sort({ siege_id: -1 }).toArray((error, result) => {
                assert.equal(null, error);
                callback(error, result);
            });
        });
    }

    // Specialized Battle Log queries
    getMostRecentBattleLogs(logType, callback) {
        this.client.connect((error) => {
            assert.equal(null, error); // based on boilerplate at api docs (link above)
            const collection = this.getCollection('battleLogs');

            collection.find({ log_type: logType }).sort({ siege_id: -1 }).limit(1).next((error, result) => {
                assert.equal(null, error);
                callback(error, result);
            });
        });
    }
}

module.exports.DBClient = DBClient;