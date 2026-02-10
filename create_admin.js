require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./backend/models/User'); // Adjust path as needed
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
    try {
        const dbURI = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!dbURI) {
            throw new Error('MongoDB Connection URI not found in environment variables');
        }

        await mongoose.connect(dbURI);
        console.log('MongoDB Connected');

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@realestate.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        // Check if admin exists
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin user already exists. Updating password/ensuring valid state...');
            await User.deleteOne({ email: adminEmail });
            console.log('Existing admin removed.');
        }

        // Create new admin with PLAIN TEXT password
        // The User model pre-save hook will handle hashing automatically
        const newAdmin = new User({
            email: adminEmail,
            password: adminPassword,
            role: 'admin'
        });

        await newAdmin.save();
        console.log(`Admin user created/updated: ${adminEmail} / ${adminPassword}`);

        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
