const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Testimonial = require('../models/Testimonial');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only images (JPEG, PNG) are allowed'));
        }
    }
});

// @route   GET /api/testimonials
// @desc    Get all testimonials
// @access  Public
router.get('/', async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        res.json(testimonials);
    } catch (error) {
        console.error('Get testimonials error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/testimonials/:id
// @desc    Get single testimonial
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        res.json(testimonial);
    } catch (error) {
        console.error('Get testimonial error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/testimonials
// @desc    Create new testimonial
// @access  Private (Admin only)
router.post('/', auth, upload.single('photo'), async (req, res) => {
    try {
        const { name, rating, testimonial } = req.body;

        const testimonialData = {
            name,
            rating: parseInt(rating) || 5,
            testimonial
        };

        // Add photo path if uploaded
        if (req.file) {
            testimonialData.photo = '/uploads/' + req.file.filename;
        }

        const newTestimonial = new Testimonial(testimonialData);
        await newTestimonial.save();

        res.status(201).json(newTestimonial);
    } catch (error) {
        console.error('Create testimonial error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/testimonials/:id
// @desc    Update testimonial
// @access  Private (Admin only)
router.put('/:id', auth, upload.single('photo'), async (req, res) => {
    try {
        const { name, rating, testimonial } = req.body;

        const testimonialDoc = await Testimonial.findById(req.params.id);
        if (!testimonialDoc) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }

        // Update fields
        testimonialDoc.name = name || testimonialDoc.name;
        testimonialDoc.rating = rating ? parseInt(rating) : testimonialDoc.rating;
        testimonialDoc.testimonial = testimonial || testimonialDoc.testimonial;

        // Update photo if new file uploaded
        if (req.file) {
            testimonialDoc.photo = '/uploads/' + req.file.filename;
        }

        await testimonialDoc.save();
        res.json(testimonialDoc);
    } catch (error) {
        console.error('Update testimonial error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/testimonials/:id
// @desc    Delete testimonial
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }

        await testimonial.deleteOne();
        res.json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
        console.error('Delete testimonial error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
