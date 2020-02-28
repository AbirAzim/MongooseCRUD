const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    mongoClient.connect('mongodb+srv://badhon:iwilldoit@cluster0-uiuo7.mongodb.net/shop?retryWrites=true&w=majority')
        .then((client) => {
            console.log('connected!!');
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found !!';
}

exports.mongoConnect = mongoConnect; // use for starting the app
exports.getDb = getDb; //use this for get the client from other module