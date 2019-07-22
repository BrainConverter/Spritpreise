const mongoose = require('mongoose');

let database;

const connect = (host, port, db) => {
  const url = `mongodb://${host}:${port}/${db}`
  mongoose.connect(url, { useNewUrlParser: true });
  database = mongoose.connection;
  console.log(`Successfully connected to database: ${db} at ${host}:${port}/${db}`);
};

module.exports.db = database;
module.exports.establishConnection = connect;