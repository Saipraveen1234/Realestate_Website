# Real Estate Website - Setup Guide

## 🚀 Quick Start

Follow these steps to get your real estate website up and running:

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup MongoDB

**Option A: Local MongoDB**
- Install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service:
  ```bash
  # macOS (using Homebrew)
  brew services start mongodb-community
  
  # Or run manually
  mongod --dbpath=/path/to/data/directory
  ```

**Option B: MongoDB Atlas (Cloud - Recommended)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get your connection string
- Update `MONGODB_URI` in `.env` file

### 3. Configure Environment Variables

The `.env` file is already created with default values. Update if needed:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Change to a random secure string
- `SESSION_SECRET` - Change to a random secure string

### 4. Create Admin User

Run this command to create the default admin user:

```bash
node -e "require('dotenv').config(); const mongoose = require('mongoose'); const User = require('./backend/models/User'); mongoose.connect(process.env.MONGODB_URI).then(async () => { const user = new User({ email: 'admin@realestate.com', password: 'admin123' }); await user.save(); console.log('Admin user created!'); process.exit(); });"
```

Or use the admin registration endpoint (first time only):
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@realestate.com","password":"admin123"}'
```

### 5. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### 6. Access the Application

- **Frontend Website:** http://localhost:5000
- **Admin Panel:** http://localhost:5000/admin
- **Admin Login:**
  - Email: admin@realestate.com
  - Password: admin123

## 📁 Project Structure

```
realestate-website/
├── frontend/              # Public website
│   ├── index.html        # Main page
│   ├── css/
│   │   └── styles.css    # Custom styles
│   ├── js/
│   │   ├── main.js       # Main functionality
│   │   └── api.js        # API integration
│   └── assets/
│       └── images/       # Website images
│
├── backend/              # Node.js server
│   ├── server.js         # Main server file
│   ├── routes/           # API routes
│   │   ├── auth.js       # Authentication
│   │   ├── projects.js   # Projects CRUD
│   │   └── testimonials.js # Testimonials CRUD
│   ├── models/           # MongoDB models
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Testimonial.js
│   ├── middleware/
│   │   └── auth.js       # JWT authentication
│   └── config/
│       └── db.js         # Database connection
│
├── admin/                # Admin panel
│   ├── login.html        # Admin login
│   ├── dashboard.html    # Admin dashboard
│   └── js/
│       └── admin.js      # Admin functionality
│
└── uploads/              # Uploaded files
```

## 🎯 Features

### Frontend
- ✅ Responsive design with Tailwind CSS
- ✅ Smooth scrolling navigation
- ✅ Hero slider with Swiper.js
- ✅ Animated sections with AOS
- ✅ Dynamic project listings
- ✅ Testimonials carousel
- ✅ WhatsApp floating button
- ✅ Back to top button

### Backend
- ✅ RESTful API with Express.js
- ✅ MongoDB database with Mongoose
- ✅ JWT authentication
- ✅ File upload with Multer
- ✅ CORS enabled
- ✅ Error handling

### Admin Panel
- ✅ Secure login
- ✅ Dashboard with statistics
- ✅ Manage projects (Add, Edit, Delete)
- ✅ Manage testimonials (Add, Edit, Delete)
- ✅ Image upload for projects and testimonials
- ✅ PDF brochure upload for projects

## 🔧 API Endpoints

### Public Endpoints
- `GET /api/projects` - Get all projects
- `GET /api/testimonials` - Get all testimonials

### Admin Endpoints (Require Authentication)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register admin (first time only)

**Projects:**
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

**Testimonials:**
- `POST /api/testimonials` - Create testimonial
- `PUT /api/testimonials/:id` - Update testimonial
- `DELETE /api/testimonials/:id` - Delete testimonial

## 🖼️ Adding Content

### Adding a Project
1. Login to admin panel
2. Click "Add Project"
3. Fill in project details:
   - Name, Size, Location, Price, Facing
   - Status (Ongoing/Upcoming/Completed)
   - Upload project image (optional)
   - Upload brochure PDF (optional)
4. Click "Save Project"

### Adding a Testimonial
1. Login to admin panel
2. Go to "Manage Testimonials" tab
3. Click "Add Testimonial"
4. Fill in client details:
   - Name, Rating (1-5 stars)
   - Testimonial text
   - Upload client photo (optional)
5. Click "Save Testimonial"

## 🚀 Deployment

### Frontend
Deploy to:
- Netlify
- Vercel
- GitHub Pages

### Backend
Deploy to:
- Railway (Recommended)
- Render
- Heroku

### Database
Use MongoDB Atlas (free tier available)

### Environment Variables
Make sure to set these in your deployment platform:
- `MONGODB_URI`
- `JWT_SECRET`
- `SESSION_SECRET`
- `NODE_ENV=production`

## 🔒 Security Notes

**IMPORTANT:** Before deploying to production:

1. ✅ Change `JWT_SECRET` and `SESSION_SECRET` to strong random strings
2. ✅ Change default admin password after first login
3. ✅ Use HTTPS in production
4. ✅ Enable MongoDB authentication
5. ✅ Disable the `/api/auth/register` endpoint after creating admin user
6. ✅ Set up proper CORS origins
7. ✅ Use environment variables for all secrets

## 📝 Customization

### Colors
Edit `tailwind.config` in `frontend/index.html`:
```javascript
colors: {
  'primary-orange': '#FF914D',  // Change to your brand color
  'dark-charcoal': '#212529',
  // ... other colors
}
```

### Fonts
Update Google Fonts link in `frontend/index.html`

### Logo
Replace the text logo in navbar with your logo image

### Contact Information
Update in `frontend/index.html`:
- Phone number
- Email
- Address
- WhatsApp link
- Social media links

## 🐛 Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For Atlas, whitelist your IP address

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill the process using port 5000:
  ```bash
  lsof -ti:5000 | xargs kill -9
  ```

### File Upload Not Working
- Check `uploads/` directory exists
- Check file permissions
- Verify Multer configuration

### Admin Login Not Working
- Make sure admin user is created
- Check JWT_SECRET is set
- Clear browser localStorage

## 📞 Support

For issues or questions, check:
- README.md
- Code comments
- MongoDB documentation
- Express.js documentation

## 📄 License

MIT License - Feel free to use for your projects!
