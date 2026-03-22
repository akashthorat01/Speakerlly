const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/angelina-speak';
        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        console.log(`\n⚠️  WARNING: MongoDB is not running locally on port 27017!`);
        console.log(`The server will continue to run for UI development, but Backend routes will fail until a DB is provided.\n`);
        // process.exit(1);
    }
};

module.exports = { connectDB };
