const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const dbURI = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!dbURI) {
            throw new Error('MongoDB Connection URI not found in environment variables (MONGODB_URI or MONGO_URI)');
        }
        const conn = await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
