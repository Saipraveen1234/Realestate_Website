# Real Estate Website

A modern real estate website with admin panel for managing projects and testimonials.

## Tech Stack

### Frontend
- HTML5
- Tailwind CSS
- Vanilla JavaScript
- Swiper.js (carousels)
- AOS (scroll animations)
- Font Awesome (icons)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary (image storage)

## Features

- 🏠 Beautiful single-page real estate website
- 📊 Admin panel for content management
- 🖼️ Image upload and management
- 💬 Testimonials management
- 🏗️ Projects management (Ongoing, Upcoming, Completed)
- 🔒 Secure authentication
- 📱 Fully responsive design

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd realestate-website
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` file with your configuration:
- MongoDB connection string
- JWT secret
- Cloudinary credentials (optional)

### 4. Start MongoDB
Make sure MongoDB is running on your system or use MongoDB Atlas.

### 5. Run the application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### 6. Access the application

- **Frontend:** http://localhost:5000
- **Admin Panel:** http://localhost:5000/admin
- **Default admin credentials:**
  - Email: admin@realestate.com
  - Password: admin123

## Project Structure

```
realestate-website/
├── frontend/              # Public website
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
├── backend/               # Node.js server
│   ├── server.js
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── middleware/
│   └── config/
├── admin/                 # Admin panel
│   ├── dashboard.html
│   ├── projects.html
│   └── testimonials.html
└── uploads/               # Uploaded images
```

## API Endpoints

### Public API
- `GET /api/projects` - Get all projects
- `GET /api/testimonials` - Get all testimonials

### Admin API (Protected)
- `POST /api/auth/login` - Admin login
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/testimonials` - Create testimonial
- `PUT /api/testimonials/:id` - Update testimonial
- `DELETE /api/testimonials/:id` - Delete testimonial

## Deployment

### Frontend
- Deploy to Netlify, Vercel, or GitHub Pages

### Backend
- Deploy to Railway, Render, or Heroku
- Use MongoDB Atlas for database

## License

MIT
