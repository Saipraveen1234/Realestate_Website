# MongoDB Setup Guide

## The Issue
You're getting "Authentication failed" because your MongoDB Atlas connection string has issues:
- Incomplete username: `realestate_db_` (trailing underscore)
- The credentials don't match what's in Atlas

## Solution: Install MongoDB Locally

I've already updated your `.env` file to use local MongoDB. Now let's install it:

### Step 1: Install MongoDB
```bash
brew tap mongodb/brew
brew install mongodb-community
```

### Step 2: Start MongoDB
```bash
brew services start mongodb-community
```

### Step 3: Verify MongoDB is Running
```bash
mongosh --eval "db.version()"
```

### Step 4: Create Admin User
```bash
node -e "require('dotenv').config(); const mongoose = require('mongoose'); const User = require('./backend/models/User'); mongoose.connect(process.env.MONGODB_URI).then(async () => { const user = new User({ email: 'admin@realestate.com', password: 'admin123' }); await user.save(); console.log('Admin user created!'); process.exit(); });"
```

### Step 5: Start Your Server
```bash
npm run dev
```

---

## Alternative: Fix MongoDB Atlas Connection

If you prefer to use MongoDB Atlas instead, you need to:

1. **Go to MongoDB Atlas** (https://cloud.mongodb.com)
2. **Get the correct connection string:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Add database name: `/realestate` before the `?`

3. **Update `.env` file:**
```bash
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.p9iu6jk.mongodb.net/realestate?retryWrites=true&w=majority
```

4. **Whitelist your IP address:**
   - In Atlas, go to "Network Access"
   - Click "Add IP Address"
   - Add your current IP or use `0.0.0.0/0` (allow from anywhere - for development only)

---

## Quick Commands (Copy & Paste)

**Install MongoDB:**
```bash
brew tap mongodb/brew && brew install mongodb-community
```

**Start MongoDB:**
```bash
brew services start mongodb-community
```

**Create Admin User:**
```bash
cd /Users/malleshasaipraveen/Desktop/Websites/Realestate-Website\(Pavan\) && node -e "require('dotenv').config(); const mongoose = require('mongoose'); const User = require('./backend/models/User'); mongoose.connect(process.env.MONGODB_URI).then(async () => { const user = new User({ email: 'admin@realestate.com', password: 'admin123' }); await user.save(); console.log('Admin user created!'); process.exit(); });"
```

**Start Server:**
```bash
npm run dev
```
