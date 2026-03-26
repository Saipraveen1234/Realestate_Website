require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || 'admin@realestate.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

async function resetAdmin() {
    try {
        const dbURI = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!dbURI) throw new Error('MONGODB_URI not set in .env');

        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✓ Connected to MongoDB');

        // Delete existing admin and recreate with correct password
        await User.deleteOne({ email: ADMIN_EMAIL });
        console.log(`✓ Removed old admin account for ${ADMIN_EMAIL}`);

        const user = new User({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
        await user.save();

        console.log('✓ Admin password reset successfully!');
        console.log(`  Email:    ${ADMIN_EMAIL}`);
        console.log(`  Password: ${ADMIN_PASSWORD}`);
        process.exit(0);

    } catch (err) {
        console.error('✗ Error:', err.message);
        process.exit(1);
    }
}

resetAdmin();
