const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect("mongodb+srv://manoj34003:YgxfXYzi7keuPp3X@backenddb.vaw8bkl.mongodb.net/Node-API?retryWrites=true&w=majority&appName=BackendDB");
    console.log(
      "Database connected: ",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDb;
