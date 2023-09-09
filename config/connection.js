const { connect, connection } = require("mongoose"); // import mongoose methods

const connectionString =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/socialNetworkDB"; // set connection string

connect(connectionString); // connect to database

module.exports = connection; // export connection object
