const mongodb = require('mongodb').MongoClient;

class DatabaseUtil {
  constructor() {
    this._db = null;
  }
  
  mongoConnect(callback) {
    mongodb.connect(process.env.DATABASE_URI)
    .then(client => {
      console.log('Connected');
      // For older version of mongo they need the db name, can be found on atlas by lookingi n collections, 
      // connection string is also different for this older version compared to the newer versions of mongo.
      // You can pass it in the connect function as { dbName: 'test' } as well.
      this._db = client.db('test');
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    })
  };
  
  getDb() {
    if (this._db) {
      return this._db;
    }
    throw 'No database found!';
  }
}

module.exports = new DatabaseUtil();